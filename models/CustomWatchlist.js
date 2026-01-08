// models/CustomWatchlist.js
const mongoose = require('mongoose');

const customWatchlistSchema = new mongoose.Schema({
  userId: { type: String, default: 'defaultUser' }, // for future multi-user
  tickers: [{ type: String, required: true }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CustomWatchlist', customWatchlistSchema);
