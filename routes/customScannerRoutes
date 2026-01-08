// routes/customScannerRoutes.js
const express = require('express');
const router = express.Router();
const {
  saveWatchlist,
  getWatchlistData
} = require('../controllers/customScannerController');

router.post('/', saveWatchlist);       // Save/update custom watchlist
router.get('/', getWatchlistData);     // Get coin data for watchlist

module.exports = router;
