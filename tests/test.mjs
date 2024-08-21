import request from 'supertest';
import mongoose from 'mongoose';
import { expect } from 'chai';
import app from '../app.mjs';
import { User }  from '../routes/model.mjs';

describe('POST /sign-up', () => {
  after(async () => {
    // Close the connection to the in-memory database
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up the database before each test
    await User.deleteMany({});
  });

  it('should create a new user when valid data is provided', async () => {
    const response = await request(app)
      .post('/sign-up')
      .send({ username: 'testuser', password: 'testpass' });

    expect(response.status).to.equal(201);
    expect(response.text).to.equal("User created\n");
  });

  it('should return 400 if username or password is missing', async () => {
    const response = await request(app)
      .post('/sign-up')
      .send({ username: 'testuser' });

    expect(response.status).to.equal(400);
    expect(response.text).to.equal("Username and password are required\n");
  });

  it('should return 409 if username already exists', async () => {
    await new User({ username: 'testuser', password: 'testpass' }).save();

    const response = await request(app)
      .post('/sign-up')
      .send({ username: 'testuser', password: 'newpass' });

    console.log(response.text)
    expect(response.status).to.equal(409);
    expect(response.text).to.equal("Username already exists choose another username\n");
  });
});
