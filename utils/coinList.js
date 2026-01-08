// utils/coinList.js
const axios = require('axios');
const cache = require('./cache');

const CACHE_KEY = 'coinGeckoList';

// Fetch CoinGecko IDs
async function getCoinList() {
  let coins = cache.get(CACHE_KEY);
  if (coins) return coins;

  const res = await axios.get('https://api.coingecko.com/api/v3/coins/list');
  coins = res.data; // Array of { id, symbol, name }
  cache.set(CACHE_KEY, coins, 3600); // Cache 1 hour
  return coins;
}

module.exports = getCoinList;
