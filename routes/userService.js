const bcrypt = require('bcrypt')
const saltRounds = 10

const userRepository = require('./userRepository')

async function registerUser(username, password) {
  if (!username || !password) {
    throw new Error('Username and password are required')
  }

  // check if the username already exists in the database
  const existinguser = await userRepository.findOne({ username })
  if (existinguser) {
    throw new Error('Username already exists')
  }

  // hash the password befor storing in the database
  const hashedpassword = await bcrypt.hash(password, saltRounds)

  // create and save the user to the database
  await userRepository.save({
    username: username,
    password: hashedpassword,
  })
}

module.exports = { registerUser }
