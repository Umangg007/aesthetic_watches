import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { globalStore } from '../store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'dharohar-super-secret-key-2026';

export const authUser = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    let user = null;

    if (mongoose.connection.readyState === 1) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      user = globalStore.users.find(u => u._id === decoded.id || u.id === decoded.id);
    }
    
    if (!user) {
      return res.status(401).json({ message: 'User not found, token invalid' });
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is invalid or expired' });
  }
};
