const mongoose = require('mongoose');
const process = require('process');
const app = require('./app');
const { run: runKafkaConsumer } = require('./routes/consumer'); 
const { startProducer } = require('./routes/producer'); 
const { createTopic } = require('./routes/admin');

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/plants');

mongoose.connection.on('connected', async () => {
  console.log('Connected to MongoDB');

  try {
    await createTopic('user-signup');
    await startProducer(); // Start Kafka producer
    await runKafkaConsumer(); // Start Kafka consumer
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Error setting up Kafka or starting server:', error);
    process.exit(1); // Exit process if setup fails
  }
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); // Exit process on MongoDB connection error
});

// Graceful shutdown handling
const shutdown = async () => {
  console.log('Shutting down gracefully...');
  try {
    // Close MongoDB connection
    await mongoose.connection.close();
    // Close Kafka producer and consumer connections
    await producer.disconnect(); // Ensure you export and use the producer instance in consumer.js
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
