const request = require('supertest')
const express = require('express')
const chai = require('chai')
const sinon = require('sinon')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { assert } = chai

// import test data
const testCases = require('./test-data')

// sign up imports
const userService = require('../routes/userService')
const userRepository = require('../routes/userRepository')

// login imports
const authService = require('../routes/authService')
const { User } = require('../routes/model')

let registerUserStub = sinon.stub(userService, 'registerUser')
let authUserStub = sinon.stub(authService, 'authenticateUser')

const app = express()
app.use(express.json())

const router = require('../routes/auth')
app.use('/', router)

describe('POST /sign-up', () => {
  afterEach(() => {
    registerUserStub.reset(), registerUserStub.restore()
  })

  testCases.forEach(
    ({ description, payload, expectedStatus, expectedText }) => {
      it(`should return ${expectedStatus} and error message "${expectedText.trim()}" when ${description}`, async function () {
        registerUserStub.rejects(new Error(expectedText.trim()))

        const response = await request(app).post('/sign-up').send(payload)
        assert.equal(response.status, expectedStatus)
        assert.equal(response.text, expectedText)
      })
    },
  )

  it('should return 201 when user is successfully created', async () => {
    registerUserStub.resolves({ username: 'testuser' })
    const response = await request(app).post('/sign-up').send({
      username: 'testuser',
      password: 'testpassword',
    })

    assert.equal(response.status, 201)
    assert.equal(response.text, 'User created\n')
  })

  it('should return 409 if username already exists', async function () {
    registerUserStub.rejects(new Error('Username already exists'))

    const response = await request(app).post('/sign-up').send({
      username: 'testuser',
      password: 'testpassword',
    })

    assert.equal(response.status, 409)
    assert.equal(response.text, 'Username already exists\n')
  })
})

describe('./routes/userService.js registerUser', () => {
  let findOneStub
  let saveStub
  let hashStub

  beforeEach(() => {
    findOneStub = sinon.stub(userRepository, 'findOne')
    saveStub = sinon.stub(userRepository, 'save')
    hashStub = sinon.stub(bcrypt, 'hash')
  })

  afterEach(() => {
    sinon.restore()
    sinon.reset()
    findOneStub.restore()
    saveStub.restore()
    hashStub.restore()
  })

  it('should throw password is not provided', async () => {
    try {
      await userService.registerUser('user123', null)
    } catch (err) {
      assert.equal(err.message, 'Username and password are required')
    }
  })

  it('should throw username is not provided', async () => {
    try {
      await userService.registerUser(null, 'password123')
    } catch (err) {
      assert.equal(err.message, 'Username and password are required')
    }
  })

  it('should throw username and are not provided', async () => {
    try {
      await userService.registerUser(null, null)
    } catch (err) {
      assert.equal(err.message, 'Username and password are required')
    }
  })

  it('should throw username already exist', async () => {
    // simulating the existing username
    findOneStub.resolves({ username: 'user123' })

    try {
      await userService.registerUser('user123', 'pass123')
      assert.fail('Expected error not thrown')
    } catch (err) {
      assert.equal(err.message, 'Username already exists')
    }
  })

  it("should hash the password and save the user if it doesn't exist", async () => {
    // null meaning username doesn't exist hence can be created
    findOneStub.resolves(null)
    hashStub.resolves('hashedPassword')

    await userService.registerUser('user123', 'pass123')

    assert.isTrue(findOneStub.calledOnceWith({ username: 'user123' }))
    assert.isTrue(hashStub.calledOnceWith('pass123', sinon.match.number))
    assert.isTrue(
      saveStub.calledOnceWith({
        username: 'user123',
        password: 'hashedPassword',
      }),
    )
  })
})

describe('POST /log-in', () => {
  afterEach(() => {
    authUserStub.reset(), authUserStub.restore()
  })

  it('should return 200 if user credential is valid and return token', async () => {
    authUserStub.resolves('token')
    const response = await request(app).post('/log-in').send({
      username: 'user123',
      password: 'correct password',
    })
    assert.equal(response.status, '200')
  })

  testCases.forEach(
    ({ description, payload, expectedStatus, expectedText }) => {
      it(`should return ${expectedStatus} and error message "${expectedText.trim()}" when ${description}`, async function () {
        authUserStub.rejects(new Error(expectedText.trim()))

        const response = await request(app).post('/log-in').send(payload)
        assert.equal(response.status, expectedStatus)
        assert.equal(response.text, expectedText)
      })
    },
  )

  it("should throw 401 Invalid credentials if user doesn't exist in db", async () => {
    authUserStub.rejects(new Error('Invalid credentials'))

    const response = await request(app).post('/log-in').send({
      username: 'user123',
      password: 'correct password',
    })
    assert.equal(response.status, 401)
    assert.equal(response.text, 'Invalid credentials\n')
  })
})

describe('./routes/authService.js', () => {
  let findOneStub, signStub, BcryptCompareStub, authUserStub

  beforeEach(() => {
    findOneStub = sinon.stub(userRepository, 'findOne')
    signStub = sinon.stub(jwt, 'sign')
    BcryptCompareStub = sinon.stub(bcrypt, 'compare')
    authUserStub = sinon.stub(authService, 'authenticateUser')
  })

  afterEach(() => {
    sinon.restore()
  })

  testCases.forEach(
    ({ description, payload, expectedStatus, expectedText }) => {
      it(`should return ${expectedStatus} and error message "${expectedText.trim()}" when ${description}`, async function () {
        authUserStub.rejects(new Error('Username and password are required'))
        try {
          const { username, password } = payload
          await authService.authenticateUser(username, password)
          //await authenticateUser(username, password);
          assert.fail('Expected error was not thrown')
        } catch (err) {
          assert.equal(err.message, 'Username and password are required')
        }
      })
    },
  )

  it('should perform some other test', async () => {})
})

describe('./routes/authService.js', () => {
  let findOneStub, signStub, BcryptCompareStub, authUserStub

  beforeEach(() => {
    findOneStub = sinon.stub(User, 'findOne')
    signStub = sinon.stub(jwt, 'sign')
    BcryptCompareStub = sinon.stub(bcrypt, 'compare')
  })

  afterEach(() => {
    sinon.restore()
  })

  it('should throw an error when username and password are required', async () => {
    try {
      await authService.authenticateUser(null, null)
      assert.fail('Expected error was not thrown')
    } catch (err) {
      assert.equal(err.message, 'Username and password are required')
    }
  })

  it('should throw an error when user is not found', async () => {
    findOneStub.resolves(null) // Simulate user not found
    try {
      await authService.authenticateUser('testuser', 'password123')
      assert.fail('Expected error was not thrown')
    } catch (err) {
      assert.equal(err.message, 'Invalid credentials')
    }
  })

  it('should throw an error when password does not match', async () => {
    findOneStub.resolves({ password: 'hashedPassword' })
    BcryptCompareStub.resolves(false)
    try {
      await authService.authenticateUser('testuser', 'wrongpassword')
      assert.fail('Expected error was not thrown')
    } catch (err) {
      assert.equal(err.message, 'Invalid credentials')
    }
  })

  it('should return a token when credentials are valid', async () => {
    const payload = { username: 'testuser', password: 'password123' }
    const user = {
      _id: 'userId',
      username: 'testuser',
      password: 'hashedPassword',
    }
    findOneStub.resolves(user)
    BcryptCompareStub.resolves(true)
    signStub.returns('token')

    const token = await authService.authenticateUser(
      payload.username,
      payload.password,
    )
    assert.equal(token, 'token')
    assert(signStub.calledOnce)
  })
})
