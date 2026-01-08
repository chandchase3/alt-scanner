// utils/normalizeCoin.js
const getCoinList = require('./coinList'); // This should fetch full CoinGecko coin list

/**
 * Takes an array of user inputs (name, symbol, or ID)
 * and returns an array of official uppercase tickers.
 * Invalid entries are ignored.
 *
 * @param {string[]} inputs
 * @returns {Promise<string[]>}
 */
async function normalizeCoinInputs(inputs) {
  if (!Array.isArray(inputs)) return [];

  const coinList = await getCoinList();
  const normalized = [];

  for (let input of inputs) {
    const coin = coinList.find(
      c =>
        c.id.toLowerCase() === input.toLowerCase() ||
        c.symbol.toLowerCase() === input.toLowerCase() ||
        c.name.toLowerCase() === input.toLowerCase()
    );

    if (coin) {
      normalized.push(coin.symbol.toUpperCase());
    }
  }

  return normalized;
}

module.exports = normalizeCoinInputs;
