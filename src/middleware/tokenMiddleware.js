const jwt = require('jsonwebtoken')

const jwt_secret_key = process.env.JWT_SECRET_KEY

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) {
    return res.status(401).send('Access Denied: No Token Provided\n')
  }

  jwt.verify(token, jwt_secret_key, (err, user) => {
    if (err) {
      return res.status(403).send('Access Denied: Invalid Token\n')
    }

    req.user = user // Attach the user object to the request
    next() // Move to the next middleware or route handler
  })
}

module.exports = authenticateToken
