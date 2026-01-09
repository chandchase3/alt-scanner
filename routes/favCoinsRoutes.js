// routes/favCoinsRoutes.js
import express from 'express';
import { getFavCoins, addFavCoin, deleteFavCoin, getMarketData } from '../controllers/favCoinsController.js';

const router = express.Router();

router.get('/', getFavCoins);
router.post('/', addFavCoin);
router.delete('/:id', deleteFavCoin);
router.get('/market-data', getMarketData); // optional endpoint for live market data

export default router;
