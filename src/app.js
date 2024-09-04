const express = require('express')
const morgan = require('morgan')
const process = require('process')

const routes = require('./routes/routes')

const app = express()

app.use(morgan('dev'))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/', routes)
app.use('/product', routes)

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
