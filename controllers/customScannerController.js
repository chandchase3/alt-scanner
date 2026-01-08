const axios = require('axios');
const CustomWatchlist = require('../models/CustomWatchlist');
const ScanModel = require('../models/ScanModel'); //historical data

// Utils
const getCoinList = require('../utils/coinList');
const normalizeCoinInputs = require('../utils/normalizeCoin');
const nameToTicker = require('../utils/coinNameToTicker');
const { getCoinGeckoId } = require('../utils/coinHelpers');
const cache = require('../utils/cache');
const { logCoinGeckoRequest } = require('../utils/logger');


// Constants for caching
const CACHE_KEY_TICKERS = 'customWatchlist';
const CACHE_KEY = 'customWatchlist';
const CACHE_KEY_COINS = 'customWatchlistCoins';
const COINS_CACHE_TTL = 10

// POST '/'
exports.saveWatchlist = async (req, res) => {
  const { tickers } = req.body;
  
  // Validate input
  if (!tickers || !Array.isArray(tickers) || tickers.length === 0) {
    return res.status(400).json({ error: 'Please provide an array of tickers' });
  }

  try {
    // Save the tickers to MongoDB, overwrite existing
    const updated = await CustomWatchlist.findOneAndUpdate(
      { userId: 'defaultUser' },                          // single user example
      { tickers: tickers.map(t => t.toUpperCase()), updatedAt: new Date() },
      { upsert: true, new: true }
    );

    // Update cache
    cache.set(CACHE_KEY_TICKERS, updated.tickers);
    cache.del(CACHE_KEY_COINS); // invalidate coin cache because tickers changed

    res.json({ success: true, tickers: updated.tickers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to save watchlist' });
  }
};

// Helper to log requests with timestamp
const logRequest = (message) => {
  console.log(`[${new Date().toISOString()}] ${message}`);
};

// GET '/' - Fetch watchlist + coin data
exports.getWatchlistData = async (req, res) => {
  try {
    // -----------------------------
    // Step 1: Get tickers from cache or DB
    // -----------------------------
    let tickers = cache.get(CACHE_KEY_TICKERS);
    if (!tickers) {
      const doc = await CustomWatchlist.findOne({ userId: 'defaultUser' });
      tickers = doc ? doc.tickers : [];
      cache.set(CACHE_KEY_TICKERS, tickers);
      logRequest(`Fetched tickers from DB: ${tickers.join(', ')}`);
    } else {
      logRequest(`Fetched tickers from cache: ${tickers.join(', ')}`);
    }

    if (!tickers || tickers.length === 0) {
      return res.json({ tickers: [], coins: {} });
    }

    // -----------------------------
    // Step 2: Check cached coin data
    // -----------------------------
    const cachedCoins = cache.get(CACHE_KEY_COINS);
    if (cachedCoins) {
      logRequest('Returning coins from cache');
      return res.json({ tickers, coins: cachedCoins });
    }

    // -----------------------------
    // Step 3: Fetch from CoinGecko
    // -----------------------------
    const coinIds = tickers.map(t => t.toLowerCase()).join(','); // backend now expects proper IDs or names
    logRequest(`Fetching from CoinGecko: ${coinIds}`);

    const response = await axios.get(
      'https://api.coingecko.com/api/v3/coins/markets',
      {
        params: {
          vs_currency: 'usd',
          ids: coinIds,
          order: 'market_cap_desc',
          per_page: 250,
          page: 1,
          sparkline: false
        }
      }
    );

    // -----------------------------
    // Step 4: Transform data
    // -----------------------------
    const coins = {};
    for (const coin of response.data) {
      // Match by ticker (symbol) for frontend
      const ticker = coin.symbol.toUpperCase();
      coins[ticker] = {
        price: coin.current_price,
        change24h: coin.price_change_percentage_24h,
        volume24h: coin.total_volume,
        marketCap: coin.market_cap,
        high24h: coin.high_24h,
        low24h: coin.low_24h
      };

      // Optional: store in ScanModel
      // await ScanModel.create({
      //   ticker,
      //   price: coin.current_price,
      //   change24h: coin.price_change_percentage_24h,
      //   volume24h: coin.total_volume,
      //   marketCap: coin.market_cap
      // });
    }

    // -----------------------------
    // Step 5: Cache results for 20 seconds
    // -----------------------------
    cache.set(CACHE_KEY_COINS, coins, 20);
    logRequest(`Cached coins for 20s`);

    console.log('Tickers:', tickers);
    console.log('Coins:', coins);

    return res.json({ tickers, coins });

  } catch (err) {
    if (err.response?.status === 429) {
      logRequest('CoinGecko API rate limit exceeded');
      return res.status(429).json({ error: 'CoinGecko API rate limit exceeded. Please try again later.' });
    }

    console.error(err);
    res.status(500).json({ error: 'Failed to fetch watchlist data' });
  }
};

// PATCH '/' - Edit watchlist (add/remove tickers)
exports.editWatchlist = async (req, res) => {
  const { add = [], remove = [] } = req.body;

  try {
    const doc = await CustomWatchlist.findOne({ userId: 'defaultUser' });
    if (!doc) return res.status(404).json({ error: 'Watchlist not found' });

    let tickers = doc.tickers;

    // Normalize and add new tickers
    const normalizedAdd = await normalizeCoinInputs(add);
    for (const t of normalizedAdd) {
      if (!tickers.includes(t)) tickers.push(t);
    }

    // Remove tickers (already in symbols)
    tickers = tickers.filter(t => !remove.map(r => r.toUpperCase()).includes(t));

    const updated = await CustomWatchlist.findOneAndUpdate(
      { userId: 'defaultUser' },
      { tickers, updatedAt: new Date() },
      { new: true }
    );

    cache.set(CACHE_KEY, updated.tickers);
    res.json({ success: true, tickers: updated.tickers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to edit watchlist' });
  }
};

// DELETE '/' - Delete entire watchlist
exports.deleteWatchlist = async (req, res) => {
  try {
    await CustomWatchlist.findOneAndDelete({ userId: 'defaultUser' });

    // Clear caches
    cache.del(CACHE_KEY_TICKERS);
    cache.del(CACHE_KEY_COINS);

    res.json({ success: true, message: 'Watchlist deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete watchlist' });
  }
};

// DELETE '/:ticker' - Delete a single ticker from watchlist
exports.deleteTicker = async (req, res) => {
  const { ticker } = req.params;
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

    // Update caches
    cache.set(CACHE_KEY_TICKERS, updated.tickers);
    cache.del(CACHE_KEY_COINS);

    res.json({ success: true, tickers: updated.tickers });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete ticker' });
  }
};
