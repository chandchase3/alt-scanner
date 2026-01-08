const axios = require('axios');

// Converts a user input (name or symbol) into a CoinGecko ID
const getCoinGeckoId = async (input) => {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/list');
    const coins = response.data;

    // Find exact match by symbol OR name (case-insensitive)
    const match = coins.find(
      (c) =>
        c.symbol.toLowerCase() === input.toLowerCase() ||
        c.name.toLowerCase() === input.toLowerCase()
    );

    return match ? match.id : null;
  } catch (err) {
    console.error('Error fetching coin list from CoinGecko:', err);
    return null;
  }
};

module.exports = { getCoinGeckoId };
