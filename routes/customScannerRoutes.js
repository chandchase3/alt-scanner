const express = require('express');
const router = express.Router();
const {
  saveWatchlist,
  getWatchlistData,
  editWatchlist,
  deleteWatchlist,
  deleteTicker
} = require('../controllers/customScannerController');

router.post('/', saveWatchlist);         // Create / overwrite watchlist
router.get('/', getWatchlistData);       // Read watchlist + coin data
router.patch('/', editWatchlist);        // Add/remove tickers
router.delete('/', deleteWatchlist);     // Delete entire watchlist
router.delete('/:ticker', deleteTicker); // Delete single coin

module.exports = router;
