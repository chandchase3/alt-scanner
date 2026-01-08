const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/cryptoController');

// Single ticker (optional, keep if you like)
router.get('/:ticker', cryptoController.getCoinPrice);

// Multi-ticker endpoint
router.get('/', cryptoController.getMultiCoinPrices);

module.exports = router;
