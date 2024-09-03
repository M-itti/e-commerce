const kafka = require('kafka-node');
const mongoose = require('mongoose');
const process = require('process');
const app = require('./app');
require('./routes/consumer'); 

mongoose.connect('mongodb://127.0.0.1:27017/plants');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');

  const kafkaClient = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
  
  const topicName = 'email-signup-events';
  const topicsToCreate = [
    {
      topic: topicName,
      partitions: 1,
      replicationFactor: 1, 
    }
  ];

  // Load existing topics
  kafkaClient.loadMetadataForTopics([], (error, results) => {
    if (error) {
      console.error('Error fetching metadata:', error);
      process.exit(1);
    }

    const existingTopics = results[1].metadata;
    const topicExists = Object.keys(existingTopics).includes(topicName);

    if (!topicExists) {
      // Create the topic if it doesn't exist
      kafkaClient.createTopics(topicsToCreate, (error, result) => {
        if (error) {
          console.error('Error creating Kafka topics:', error);
          process.exit(1); 
        } else {
          console.log('Kafka topic created successfully:', result);
          startServer();
        }
      });
    } else {
      console.log(`Topic '${topicName}' already exists.`);
      startServer();
    }
  });
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); 
});

function startServer() {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}
