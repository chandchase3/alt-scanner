// controllers/customScannerController.js
const axios = require('axios');
const cache = require('../utils/cache');
const tickerToId = require('../utils/tickers');
const CustomWatchlist = require('../models/CustomWatchlist');
const ScanModel = require('../models/ScanModel'); // reuse ScanModel for coin data

const CACHE_KEY = 'customWatchlist';

// Save or update user's custom watchlist
exports.saveWatchlist = async (req, res) => {
  const { tickers } = req.body;
  if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of tickers' });
  }

  try {
    // Save to MongoDB
    const updated = await CustomWatchlist.findOneAndUpdate(
      { userId: 'defaultUser' },
      { tickers, updatedAt: new Date() },
      { upsert: true, new: true }
    );

    // Update cache
    cache.set(CACHE_KEY, updated.tickers);

    res.json({ success: true, tickers: updated.tickers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save watchlist' });
  }
};

// Fetch user's custom watchlist and get coin data
exports.getWatchlistData = async (req, res) => {
  try {
    // Get tickers from cache first, fallback to DB
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

    // Fetch coin data from CoinGecko
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

      // Optionally store historical data in ScanModel
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
