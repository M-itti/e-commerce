const mongoose = require('mongoose');
const process = require('process'); 
const app = require('./app'); 

mongoose.connect('mongodb://127.0.0.1:27017/plants');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');

  // Start the server after the DB connection is successful
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit the process if the DB connection fails
});
