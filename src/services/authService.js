const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { User } = require('../models/model')
require('dotenv').config({ path: '../../.env' })

const jwt_secret_key = process.env.JWT_SECRET_KEY

async function authenticateUser(username, password) {
  if (!username || !password) {
    throw new Error('Username and password are required')
  }

  // Find the user by username
  const user = await User.findOne({ username })
  if (!user) {
    throw new Error('Invalid credentials')
  }

  // Compare the provided password with the hashed password
  const isMatch = await bcrypt.compare(password, user.password)
  if (!isMatch) {
    throw new Error('Invalid credentials')
  }

  // Generate token
  const token = jwt.sign(
    { userId: user._id, username: user.username },
    'secretkey',
    { expiresIn: '1h' },
  )

  return token
}

module.exports = { authenticateUser }
