const mongoose = require('mongoose');
const process = require('process');
const app = require('./app');
const { run: startConsumer, consumer } = require('./routes/consumer'); // Import the Kafka consumer

const MONGO_URI = 'mongodb://127.0.0.1:27017/plants';
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    // Start Kafka Consumer
    await startConsumer();

    // Start the server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Error during startup:', error);
    process.exit(1);
  }
};

startServer();

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing MongoDB and Kafka connections');
  await mongoose.connection.close();
  await consumer.disconnect(); // Ensure the consumer is properly disconnected
  console.log('MongoDB and Kafka connections closed');
  process.exit(0);
});
