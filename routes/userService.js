const bcrypt = require('bcrypt')
const saltRounds = 10

// Import the repository functions
const userRepository = require('./userRepository')

async function registerUser(username, password) {
  if (!username || !password) {
    throw new Error('Username and password are required')
  }

  // Check if the username already exists in the database
  const existingUser = await userRepository.findOne({ username })
  if (existingUser) {
    throw new Error('Username already exists')
  }

  // Hash the password for storing in the database
  const hashedPassword = await bcrypt.hash(password, saltRounds)

  // Create and save the user to the database
  await userRepository.save({
    username,
    password: hashedPassword,
  })
}

module.exports = { registerUser }
