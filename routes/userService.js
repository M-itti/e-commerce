const bcrypt = require('bcrypt')
const saltRounds = 10

const userRepository = require('./userRepository')

async function registerUser(username, password, email) {
  if (!username || !password) {
    throw new Error('Username and password are required')
  }

  if (!email) {
    throw new Error('Email is required')
  }

  // check if the username already exists in the database
  const existinguser = await userRepository.findOne({ username })
  if (existinguser) {
    throw new Error('Username already exists')
  }

  // check if the email already exists in the database
  const existingEmail = await userRepository.findOne({ email })
  if (existingEmail) {
    throw new Error('Email already exists')
  }

  // hash the password befor storing in the database
  const hashedpassword = await bcrypt.hash(password, saltRounds)

  // create and save the user to the database
  await userRepository.save({
    username: username,
    password: hashedpassword,
    email: email
  })
}

module.exports = { registerUser }
