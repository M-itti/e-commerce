const mongoose = require('mongoose');
const process = require('process'); 
const app = require('./app'); 

<<<<<<< Updated upstream
=======
const PORT = process.env.PORT || 5000;

>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======

// Graceful shutdown handling
const shutdown = async () => {
  console.log('Shutting down gracefully...');
  try {
    await mongoose.connection.close();
    await producer.disconnect(); 
    console.log('Cleanup completed. Exiting...');
    process.exit(0);
  } catch (error) {
    console.error('Error during shutdown:', error);
    process.exit(1);
  }
};

// Listen for termination signals to shutdown gracefully
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);
>>>>>>> Stashed changes
