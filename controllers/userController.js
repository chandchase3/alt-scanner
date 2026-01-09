import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// helper to sign JWT
const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET || 'secret', {
    expiresIn: '1d',
  });
};

// REGISTER USER
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password)
    return res.status(400).json({ message: 'All fields are required' });

  try {
    // check if user exists
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'User already exists' });

    // HASH the password manually
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user with hashed password
    const user = await User.create({ username, email, password: hashedPassword });

    const token = signToken(user._id);

    res.status(201).json({
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// === LOGIN USER ===
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password required' });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid email or password' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid email or password' });

    const token = signToken(user._id);

    res.json({
      user: { id: user._id, username: user.username, email: user.email },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// === GET CURRENT LOGGED-IN USER ===
export const getCurrentUser = async (req, res) => {
  // Requires auth middleware to set req.user
  if (!req.user) return res.status(401).json({ message: 'Unauthorized' });

  res.json({
    id: req.user._id,
    username: req.user.username,
    email: req.user.email,
  });
};
