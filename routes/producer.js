const { Kafka, Partitioners } = require('kafkajs') // Import Partitioners if using legacy partitioner

const kafka = new Kafka({
  clientId: 'signup-service',
  brokers: ['localhost:9092'], // Update with your Kafka broker address
})

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner, // Use legacy partitioner if needed
})

const startProducer = async () => {
  try {
    await producer.connect() // Connect the producer to Kafka
    console.log('Kafka producer connected')
  } catch (error) {
    console.error('Error connecting Kafka producer:', error)
    throw error // Re-throw error to be caught by higher-level error handlers
  }
}

const sendSignupEvent = async (user) => {
  try {
    await producer.send({
      topic: 'user-signup',
      messages: [{ value: JSON.stringify(user) }], // Send JSON string
    })
    console.log(`Signup event sent for ${user.email}`)
  } catch (error) {
    console.error('Error sending message to Kafka:', error)
    throw error
  }
}

module.exports = { startProducer, sendSignupEvent, producer }
