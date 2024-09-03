const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'signup-service',
  brokers: ['localhost:9092'], 
});

const admin = kafka.admin();

const createTopic = async (topicName) => {
  await admin.connect();
  const topic = {
    topic: topicName,
    numPartitions: 1,
    replicationFactor: 1,
  };

  try {
    await admin.createTopics({
      topics: [topic],
      waitForLeaders: true,
    });
    console.log(`Topic created: ${topicName}`);
  } catch (error) {
    console.error('Error creating topic:', error);
  } finally {
    await admin.disconnect();
  }
};

module.exports = { createTopic };
