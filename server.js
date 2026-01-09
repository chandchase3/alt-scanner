// server.js
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import favCoinsRoutes from './routes/favCoinsRoutes.js';

dotenv.config();

const app = express();

// ===== MIDDLEWARE =====
app.use(cors());
app.use(express.json());

// ===== ROUTES =====
app.use('/api/fav-coins', favCoinsRoutes);

// ===== HEALTH CHECK =====
app.get('/', (req, res) => {
  res.send('Crypto Scanner Backend is running!');
});

// ===== DATABASE CONNECTION & SERVER START =====
const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });
