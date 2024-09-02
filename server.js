const kafka = require('kafka-node');
const mongoose = require('mongoose');
const process = require('process');
const app = require('./app');

mongoose.connect('mongodb://127.0.0.1:27017/plants');

mongoose.connection.on('connected', () => {
  console.log('Connected to MongoDB');

  const kafkaClient = new kafka.KafkaClient({ kafkaHost: 'localhost:9092' });
  
  const topicsToCreate = [
    {
      topic: 'email-signup-events',
      partitions: 1,
      replicationFactor: 1, 
    }
  ];

  kafkaClient.createTopics(topicsToCreate, (error, result) => {
    if (error) {
      console.error('Error creating Kafka topics:', error);
      process.exit(1); 
    } else {
      console.log('Kafka topics created successfully:', result);

      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
      });
    }
  });
});

mongoose.connection.on('error', (err) => {
  console.error('MongoDB connection error:', err);
  process.exit(1); 
});
