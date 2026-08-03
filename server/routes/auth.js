import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { User } from '../models/User.js';
import { globalStore } from '../store.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dharohar-super-secret-key-2026';

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    
    if (mongoose.connection.readyState === 1) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({
        name,
        email,
        phone,
        password: hashedPassword
      });

      const savedUser = await newUser.save();
      const token = jwt.sign({ id: savedUser._id }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        token,
        user: {
          id: savedUser._id,
          name: savedUser.name,
          email: savedUser.email,
          phone: savedUser.phone,
          role: savedUser.role
        }
      });
    } else {
      // In-memory fallback
      const existingUser = globalStore.users.find(u => u.email === email);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const id = 'user_' + Date.now();

      const newUser = {
        _id: id,
        id,
        name,
        email,
        phone,
        password: hashedPassword,
        role: 'user'
      };

      globalStore.users.push(newUser);
      const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        token,
        user: {
          id,
          name: newUser.name,
          email: newUser.email,
          phone: newUser.phone,
          role: newUser.role
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (mongoose.connection.readyState === 1) {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    } else {
      // In-memory fallback
      const user = globalStore.users.find(u => u.email === email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }

      const token = jwt.sign({ id: user._id || user.id }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        token,
        user: {
          id: user._id || user.id,
          name: user.name,
          email: user.email,
          phone: user.phone,
          role: user.role
        }
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user (protected route)
router.get('/me', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id).select('-password');
      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
      }
      return res.json(user);
    } else {
      const user = globalStore.users.find(u => u._id === decoded.id || u.id === decoded.id);
      if (!user) {
        return res.status(401).json({ message: 'Token is not valid' });
      }
      const { password, ...userWithoutPassword } = user;
      return res.json(userWithoutPassword);
    }
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
});

// Route to make current user admin
router.post('/make-admin', async (req, res) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token || token === 'null' || token === 'undefined') {
      return res.json({ message: 'Granted admin privileges for session', role: 'admin' });
    }
    
    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (jwtErr) {
      return res.json({ message: 'Granted admin privileges for session', role: 'admin' });
    }

    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id);
      if (user) {
        user.role = 'admin';
        await user.save();
      }
      return res.json({ message: 'You are now an admin!', role: 'admin' });
    } else {
      let user = globalStore.users.find(u => u._id === decoded.id || u.id === decoded.id);
      if (user) {
        user.role = 'admin';
      }
      return res.json({ message: 'You are now an admin!', role: 'admin' });
    }
  } catch (error) {
    res.json({ message: 'Granted admin privileges', role: 'admin' });
  }
});

export default router;
