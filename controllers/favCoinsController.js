// controllers/favCoinsController.js
import FavCoin from '../models/favCoin.js';
import axios from 'axios';

// === GET all favorite coins for a user ===
export const getFavCoins = async (req, res) => {
  try {
    const { userId } = req.query; // Get userId from query (or req.user.id if using auth)
    if (!userId) return res.status(400).json({ message: 'userId required' });

    const coins = await FavCoin.find({ userId }).sort({ createdAt: -1 });
    res.json(coins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// === POST add a new coin for a user ===
export const addFavCoin = async (req, res) => {
  try {
    const userId = req.user?.id;  // get userId from authentication
    const { coingeckoId } = req.body;

    if (!userId) return res.status(401).json({ message: 'Unauthorized' });
    if (!coingeckoId) return res.status(400).json({ message: 'coingeckoId required' });

    const ticker = coingeckoId.toUpperCase();

    const coin = new FavCoin({ userId, ticker, coingeckoId });
    const savedCoin = await coin.save();

    res.status(201).json(savedCoin);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Coin already exists for this user' });
    }
    res.status(500).json({ message: error.message });
  }
};

// === DELETE a coin for a user ===
export const deleteFavCoin = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    // Only delete coin if it belongs to this user
    const deleted = await FavCoin.findOneAndDelete({ _id: id, userId });
    if (!deleted) return res.status(404).json({ message: 'Coin not found for this user' });

    res.json({ message: 'Coin deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// === GET market data for all coins of a user ===
export const getMarketData = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return res.status(400).json({ message: 'userId required' });

    const coins = await FavCoin.find({ userId });
    if (!coins.length) return res.json({});

    const ids = coins.map(c => c.coingeckoId).join(',');

    const response = await axios.get(
      'https://api.coingecko.com/api/v3/simple/price',
      {
        params: {
          ids,
          vs_currencies: 'usd',
          include_24hr_change: 'true',
          include_24hr_vol: 'true',
        },
      }
    );

    res.json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
