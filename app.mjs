import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import morgan from 'morgan';

// Importing our route files
import dbRouter from './routes/db.mjs';
import authRouter from './routes/auth.mjs';

const app = express();

const port = process.env.PORT || 5000;

// Use the route file
app.use('/db', dbRouter);
app.use('/auth', authRouter);

// Set up middleware
app.use(morgan('dev')); // Log requests to the console
app.use(bodyParser.json()); // Parse incoming JSON requests
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data

// Error handling middleware
app.use((req, res, next) => {
  const error = new Error('Not Found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
