// models/favCoin.js
import mongoose from 'mongoose';

const favCoinSchema = new mongoose.Schema({
  ticker: {
    type: String,
    required: true,
    uppercase: true,
    trim: true,
  },
  coingeckoId: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('FavCoin', favCoinSchema);
