import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

mongoose.connect('mongodb://127.0.0.1:27017/test');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
});

export default router;
