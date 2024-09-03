const { Kafka, Partitioners } = require('kafkajs')

const kafka = new Kafka({
  clientId: 'signup-service',
  brokers: ['localhost:9092'],
})

const producer = kafka.producer({
  createPartitioner: Partitioners.LegacyPartitioner,
})

const startProducer = async () => {
  try {
    await producer.connect()
    console.log('Kafka producer connected')
  } catch (error) {
    console.error('Error connecting Kafka producer:', error)
    throw error
  }
}

const sendSignupEvent = async (user) => {
  try {
    await producer.send({
      topic: 'user-signup',
      messages: [{ value: JSON.stringify(user) }],
    })
    console.log(`Signup event sent for ${user.email}`)
  } catch (error) {
    console.error('Error sending message to Kafka:', error)
    throw error
  }
}

module.exports = { startProducer, sendSignupEvent, producer }
