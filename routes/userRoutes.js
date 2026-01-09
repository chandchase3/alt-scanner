import express from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/userController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected route
router.get('/me', authMiddleware, getCurrentUser);

export default router;
