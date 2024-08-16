import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

mongoose.connect('mongodb://127.0.0.1:27017/test')
  .then(() => console.log('Connected to mongodb'));

export default router;
