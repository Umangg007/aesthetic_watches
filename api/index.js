import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import apiRoutes from '../server/routes/api.js';
import authRoutes from '../server/routes/auth.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// MongoDB Connection with Caching for Vercel Serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) {
    return;
  }

  const MONGODB_URI = process.env.MONGODB_URI;
  if (!MONGODB_URI) {
    return;
  }

  try {
    const db = await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = db.connections[0].readyState === 1;
    console.log('Connected to MongoDB successfully');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
  }
};


// Middleware to ensure DB connection before route execution
app.use(async (req, res, next) => {
  await connectDB();
  next();
});

// Register API Routes
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    dbConnected: mongoose.connection.readyState === 1,
    timestamp: new Date().toISOString()
  });
});

export default app;
