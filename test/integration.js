const request = require('supertest')
const express = require('express')
const chai = require('chai')
const sinon = require('sinon')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { assert } = chai
const { MongoMemoryServer } = require('mongodb-memory-server')
const mongoose = require('mongoose')

// import test data
const testCases = require('./test-data')

// sign up imports
const userService = require('../routes/userService')
const userRepository = require('../routes/userRepository')

// login imports
const authService = require('../routes/authService')
const { User } = require('../routes/model')

const app = express()
app.use(express.json())

const router = require('../routes/auth')
app.use('/', router)

describe('POST /sign-up', () => {
  let registerUser
  let mongoServer

  before(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()

    await mongoose.connect(uri)

    console.log('Connected to in-memory MongoDB at', uri)
  })

  after(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  beforeEach(() => {
    registerUserStub = sinon.stub(userService, 'registerUser')
  })

  afterEach(() => {
    registerUserStub.reset(), registerUserStub.restore()
  })

  it('should return 201 when user is successfully created', async () => {
    const response = await request(app).post('/sign-up').send({
      username: 'testuser',
      password: 'testpassword',
    })

    assert.equal(response.status, 201)
    assert.equal(response.text, 'User created\n')
  })

  it('should return 409 if username already exist', async () => {
    const response = await request(app).post('/sign-up').send({
      username: 'testuser',
      password: 'testpassword',
    })

    assert.equal(response.status, 409)
    assert.equal(response.text, 'Username already exists\n')
  })

  it('should return 400 if  password is not sent', async () => {
    const response = await request(app).post('/sign-up').send({
      username: 'testuser'
    })
    
    assert.equal(response.status, 400)
    assert.equal(response.text, 'Username and password are required\n')
  });

  it('should return 400 if username is not sent', async () => {
    const response = await request(app).post('/sign-up').send({
      password: 'testpassword'
    })
    
    assert.equal(response.status, 400)
    assert.equal(response.text, 'Username and password are required\n')
  });

  it('should return 400 if username is not sent', async () => {
    const response = await request(app).post('/sign-up').send({
      password: 'testpassword'
    })
    
    assert.equal(response.status, 400)
    assert.equal(response.text, 'Username and password are required\n')
  });
})

describe('POST /log-in', () => {
  let authUser
  let mongoServer

  before(async () => {
    mongoServer = await MongoMemoryServer.create()
    const uri = mongoServer.getUri()

    await mongoose.connect(uri)

    console.log('Connected to in-memory MongoDB at', uri)
  })

  after(async () => {
    await mongoose.disconnect()
    await mongoServer.stop()
  })

  beforeEach(() => {
    authUserStub = sinon.stub(authService, 'authenticateUser')
  })

  afterEach(() => {
    authUserStub.reset(), authUserStub.restore()
  })

  it('should return 200 with a token', async () => {
    // creating user before login
    await request(app).post('/sign-up').send({
      username: 'testuser',
      password: 'testpass'
    })

    const response = await request(app).post('/log-in').send({
      username: 'testuser',
      password: 'testpass'
    })

    assert.equal(response.status, 200)
    assert.property(response._body, 'token');
    const tokenPattern = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+$/;
    assert.match(response._body.token, tokenPattern, 'Token should match the JWT format');

  })

  it('should return Invalid credentials', async () => {
    const response = await request(app).post('/log-in').send({
      username: 'wrongtestuser',
      password: 'wrongtestpassword'
    })

    assert.equal(response.status, 401)
    assert.equal(response.text, 'Invalid credentials\n')
  })
})
