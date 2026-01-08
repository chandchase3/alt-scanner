const axios = require('axios');
const cache = require('../utils/cache');

exports.getCoinPrice = async (req, res) => {
  const coin = req.params.coin.toLowerCase();

  // Check cache
  const cachedData = cache.get(coin);
  if (cachedData) return res.json({ source: 'cache', data: cachedData });

  try {
    const response = await axios.get(
      `https://api.coingecko.com/api/v3/simple/price?ids=${coin}&vs_currencies=usd`
    );

    cache.set(coin, response.data);

    res.json({ source: 'api', data: response.data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch crypto data' });
  }
};
