const mongoose = require('mongoose');

const scanSchema = new mongoose.Schema({
  ticker: { type: String, required: true },
  price: { type: Number, required: true },
  change24h: { type: Number },      // 24h % change
  volume24h: { type: Number },      // 24h volume
  marketCap: { type: Number },      // market cap
  timestamp: { type: Date, default: Date.now }
});

const ScanModel = mongoose.model('Scan', scanSchema);

module.exports = ScanModel;
