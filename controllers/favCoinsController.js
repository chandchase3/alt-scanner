// controllers/favCoinsController.js
import FavCoin from '../models/favCoin.js';
import axios from 'axios';

// GET all favorite coins
export const getFavCoins = async (req, res) => {
  try {
    const coins = await FavCoin.find().sort({ createdAt: -1 });
    res.json(coins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST add a new coin
export const addFavCoin = async (req, res) => {
  try {
    const { ticker, coingeckoId } = req.body;

    if (!ticker || !coingeckoId) {
      return res.status(400).json({ message: 'ticker and coingeckoId required' });
    }

    const coin = new FavCoin({ ticker, coingeckoId });
    const savedCoin = await coin.save();

    res.status(201).json(savedCoin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE a coin
export const deleteFavCoin = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await FavCoin.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: 'Coin not found' });
    res.json({ message: 'Coin deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Optional: Fetch market data for all favorite coins from CoinGecko
export const getMarketData = async (req, res) => {
  try {
    const coins = await FavCoin.find();
    console.log('Coins from DB:', coins);

    if (!coins.length) {
      console.log('No coins found');
      return res.json({});
    }

    const ids = coins.map(c => c.coingeckoId).join(',');
    console.log('CoinGecko IDs:', ids);

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

    console.log('CoinGecko response:', response.data);

    res.json(response.data);
  } catch (error) {
    console.error('Market data error:', error.message);
    res.status(500).json({ message: error.message });
  }
};

