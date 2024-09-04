const express = require('express')
const morgan = require('morgan')
const process = require('process')

const authrouter = require('./routes/routes')
const authproduct = require('./controllers/product')

const app = express()

app.use(morgan('dev'))

// encoding
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', authrouter)
app.use('/product', authproduct)

// error handling middleware
app.use((req, res, next) => {
  const error = new error('not found')
  error.status = 404
  next(error)
})

app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message,
    },
  })
})

module.exports = app
