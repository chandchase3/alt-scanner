const express = require('express');
const router = express.Router();
const {
  saveWatchlist,
  getWatchlistData,
  editWatchlist,
  deleteWatchlist,
  deleteTicker
} = require('../controllers/customScannerController');

// Create / overwrite the watchlist
router.post('/', saveWatchlist);

// Read watchlist + coin data
router.get('/', getWatchlistData);

// Edit / add/remove tickers
router.patch('/', editWatchlist);

// Delete entire watchlist
router.delete('/', deleteWatchlist);

// Delete a single ticker
router.delete('/:ticker', deleteTicker);

module.exports = router;
