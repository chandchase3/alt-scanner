const express = require('express');
const router = express.Router();
const cryptoController = require('../controllers/cryptoController');

router.get('/:coin', cryptoController.getCoinPrice);

module.exports = router;
