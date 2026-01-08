// utils/coinNameToTicker.js
const tickerToId = require('./tickers'); // your existing mapping

// Return ticker (uppercase) if name exists, else null
function nameToTicker(name) {
  const key = Object.keys(tickerToId).find(
    t => t.toLowerCase() === name.toLowerCase() || 
         tickerToId[t].toLowerCase() === name.toLowerCase()
  );
  return key || null;
}

module.exports = nameToTicker;