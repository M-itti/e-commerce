const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');

// Importing our route files
const authRouter = require('./routes/auth');
const dbRouter = require('./routes/db');

const app = express();

const port = process.env.PORT || 5000;

// use the route file
app.use('/auth', authRouter);
app.use('/db', dbRouter);

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
