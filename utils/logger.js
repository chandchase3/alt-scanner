// utils/logger.js
let requestCount = 0;

function logCoinGeckoRequest(url) {
  requestCount++;
  console.log(`[CoinGecko] Request #${requestCount} to URL: ${url} at ${new Date().toISOString()}`);
}

module.exports = { logCoinGeckoRequest };
