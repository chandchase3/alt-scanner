const axios = require('axios');
const cache = require('../utils/cache');
const tickerToId = require('../utils/tickers');
const ScanModel = require('../models/ScanModel');

// Multi-ticker fetch with full metrics
exports.getMultiCoinPrices = async (req, res) => {
  const tickersParam = req.query.tickers;
  if (!tickersParam) {
    return res.status(400).json({ error: 'Please provide tickers' });
  }

  const tickers = tickersParam.split(',').map(t => t.toUpperCase());
  const results = {};
  const fetchList = [];

  // Check cache or unsupported tickers
  for (const ticker of tickers) {
    const coinId = tickerToId[ticker];
    if (!coinId) {
      results[ticker] = { error: 'Ticker not supported' };
      continue;
    }

    const cached = cache.get(ticker);
    if (cached) {
      results[ticker] = { source: 'cache', data: cached };
    } else {
      fetchList.push({ ticker, coinId });
    }
  }

  // Fetch uncached coins from CoinGecko
  if (fetchList.length > 0) {
    try {
      const ids = fetchList.map(f => f.coinId).join(',');

      const response = await axios.get(
        'https://api.coingecko.com/api/v3/coins/markets',
        {
          params: {
            vs_currency: 'usd',
            ids: ids,
            order: 'market_cap_desc',
            per_page: 250,
            page: 1,
            sparkline: false
          }
        }
      );

      for (const coin of response.data) {
        const ticker = Object.keys(tickerToId).find(
          key => tickerToId[key] === coin.id
        );
        if (!ticker) continue;

        // Update cache
        cache.set(ticker, coin);

        // Update results object
        results[ticker] = { source: 'api', data: coin };

        // Save to MongoDB
        await ScanModel.create({
          ticker,
          price: coin.current_price,
          change24h: coin.price_change_percentage_24h,
          volume24h: coin.total_volume,
          marketCap: coin.market_cap
        });
      }
    } catch (err) {
      console.error(err);
      return res.status(500).json({ error: 'Failed to fetch crypto data' });
    }
  }

  res.json(results);
};

// Optional single ticker endpoint
exports.getCoinPrice = async (req, res) => {
  req.query.tickers = req.params.ticker;
  return exports.getMultiCoinPrices(req, res);
};
