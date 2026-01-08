const axios = require('axios');
const cache = require('../utils/cache');
const tickerToId = require('../utils/tickers');
const CustomWatchlist = require('../models/CustomWatchlist');
const ScanModel = require('../models/ScanModel'); // optional historical storage

const CACHE_KEY = 'customWatchlist';

// --------------------
// CREATE / UPDATE (POST)
// --------------------
exports.saveWatchlist = async (req, res) => {
  const { tickers } = req.body;
  if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of tickers' });
  }

  try {
    const updated = await CustomWatchlist.findOneAndUpdate(
      { userId: 'defaultUser' },
      { tickers, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    cache.set(CACHE_KEY, updated.tickers);

    res.json({ success: true, tickers: updated.tickers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save watchlist' });
  }
};

// --------------------
// READ (GET)
// --------------------
exports.getWatchlistData = async (req, res) => {
  try {
    let tickers = cache.get(CACHE_KEY);
    if (!tickers) {
      const doc = await CustomWatchlist.findOne({ userId: 'defaultUser' });
      tickers = doc ? doc.tickers : [];
      cache.set(CACHE_KEY, tickers);
    }

    if (!tickers || tickers.length === 0) {
      return res.json({ tickers: [], coins: {} });
    }

    // Map to CoinGecko IDs
    const fetchList = tickers.map(t => tickerToId[t.toUpperCase()]).filter(Boolean);
    if (fetchList.length === 0) {
      return res.json({ tickers, coins: {} });
    }

    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          ids: fetchList.join(','),
          order: 'market_cap_desc',
          per_page: 250,
          page: 1,
          sparkline: false
        }
      }
    );

    const coins = {};
    for (const coin of response.data) {
      const ticker = Object.keys(tickerToId).find(k => tickerToId[k] === coin.id);
      if (!ticker) continue;

      coins[ticker] = {
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
        volume24h: coin.total_volume,
        marketCap: coin.market_cap,
        high24h: coin.high_24h,
        low24h: coin.low_24h
      };

      // Optional: store historical data
      await ScanModel.create({
        ticker,
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
        volume24h: coin.total_volume,
        marketCap: coin.market_cap
      });
    }

    res.json({ tickers, coins });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch watchlist data' });
  }
};

// --------------------
// EDIT / MODIFY (PATCH)
// --------------------
exports.editWatchlist = async (req, res) => {
  const { add = [], remove = [] } = req.body;
  if (!Array.isArray(add) || !Array.isArray(remove)) {
    return res.status(400).json({ error: 'Add and remove must be arrays' });
  }

  try {
    const doc = await CustomWatchlist.findOne({ userId: 'defaultUser' });
    let tickers = doc ? doc.tickers : [];

    // Add new tickers (avoid duplicates)
    tickers = [...new Set([...tickers, ...add.map(t => t.toUpperCase())])];

    // Remove tickers
    tickers = tickers.filter(t => !remove.includes(t.toUpperCase()));

    // Save updated list
    const updated = await CustomWatchlist.findOneAndUpdate(
      { userId: 'defaultUser' },
      { tickers, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    cache.set(CACHE_KEY, updated.tickers);

    res.json({ success: true, tickers: updated.tickers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to edit watchlist' });
  }
};

// DELETE entire watchlist
exports.deleteWatchlist = async (req, res) => {
  try {
    await CustomWatchlist.findOneAndDelete({ userId: 'defaultUser' });
    cache.del(CACHE_KEY);

    res.json({ success: true, message: 'Watchlist deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete watchlist' });
  }
};

// DELETE a single ticker
exports.deleteTicker = async (req, res) => {
  const { ticker } = req.params; // ticker passed in URL
  if (!ticker) return res.status(400).json({ error: 'Ticker is required' });

  try {
    const doc = await CustomWatchlist.findOne({ userId: 'defaultUser' });
    if (!doc) return res.status(404).json({ error: 'Watchlist not found' });

    const updatedTickers = doc.tickers.filter(t => t.toUpperCase() !== ticker.toUpperCase());

    const updated = await CustomWatchlist.findOneAndUpdate(
      { userId: 'defaultUser' },
      { tickers: updatedTickers, updatedAt: new Date() },
      { new: true }
    );

    cache.set(CACHE_KEY, updated.tickers);

    res.json({ success: true, tickers: updated.tickers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete ticker' });
  }
};
