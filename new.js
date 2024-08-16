const express = require('express');
const nunjucks = require('nunjucks');
const mongoose = require('mongoose');
const path = require('path');

// Importing our route files
const loginRouter = require('./routes/auth');
const dbRouter = require('./routes/db');

const app = express();
const port = 5000;

const morgan = require('morgan');
app.use(morgan('dev'));

// Configure Nunjucks
nunjucks.configure(path.join(__dirname, 'views'), {
    autoescape: true,
    express: app,
});

// Use the route file
app.use('/auth', loginRouter);
app.use('/db', dbRouter);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Use External routes
app.use('/', authRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 3000 // Increase timeout
})
.then(() => console.log('MongoDB connected successfully'))
.catch(err => {
  console.error('MongoDB connection error:', err);
});


// Start the server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
