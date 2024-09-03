const { Kafka } = require('kafkajs')
const nodemailer = require('nodemailer')

// KafkaJS setup
const kafka = new Kafka({
  clientId: 'my-app',
  brokers: ['localhost:9092'], 
})

const consumer = kafka.consumer({
  groupId: 'email-service-group', 
})

// Nodemailer setup
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'johnjohndoe283@gmail.com',
    pass: 'vnan pjcf llvp frnb',
  },
})

const sendEmail = async (user) => {
  const mailOptions = {
    from: 'johnjohndoe283@gmail.com', 
    to: user,
    subject: 'Welcome to Our Platform!',
    text: `Hi ${user.name},\n\nThank you for signing up for our platform! We're excited to have you onboard.\n\nBest regards,\nThe Team`,
  }

  try {
    await transporter.sendMail(mailOptions)
    console.log(`Email sent to ${user}`)
  } catch (error) {
    console.error('Error sending email:', error)
  }
}

const run = async () => {
  try {
    await consumer.connect()
    await consumer.subscribe({ topic: 'user-signup', fromBeginning: true })

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        const user = JSON.parse(message.value.toString())
        console.log(`Received signup event for ${user}`)
        await sendEmail(user)
      },
    })
  } catch (error) {
    console.error('Error running Kafka consumer:', error)
  }
}

module.exports = { run, consumer }
