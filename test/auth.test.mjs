import request from "supertest";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import sinon from "sinon";
import bcrypt from "bcrypt";
import { assert, expect } from "chai";

import app from "../app.mjs";
import { User } from "../routes/model.mjs";

// TODO create nested describe for different functionalities wthin the
// login

describe("POST /log-in", () => {
  let bcryptCompareStub;
  let findOneStub;
  let jwtSignStub;

  beforeEach(() => {
    sinon.restore();
    jwtSignStub = sinon.stub(jwt, "sign");
  });

  afterEach(() => {
    sinon.restore();
    jwtSignStub.restore();
  });

  it("should return 400 for missing or empty fields", async () => {
    const cases = [
      { username: "", password: "" },
      { username: "user1", password: "" },
      { username: "", password: "pass1" },
    ];

    for (const body of cases) {
      const response = await request(app).post("/log-in").send(body);
      assert.equal(response.status, 400, "should be 400 for empty fields");
    }
  });
  // TODO: add user found test too
  it("should return 401 if user not found", async () => {
    sinon.stub(User, "findOne").resolves(null); // Stub User.findOne to return null

    const response = await request(app)
      .post("/log-in")
      .send({ username: "nonexistentuser", password: "randomPass" });

    assert.equal(response.status, 401, "Status 401 user is not found");
    assert.equal(response.text, "Invalid credentials\n");
  });

  it("should return 401 when password does not match", async () => {
    bcryptCompareStub = sinon.stub(bcrypt, "compare");
    bcryptCompareStub.resolves(false);
    const res = await request(app)
      .post("/log-in")
      .send({ username: "randomuser", password: "wrongpassword" });

    assert.strictEqual(res.status, 401);
    assert.strictEqual(res.text, "Invalid credentials\n");
  });

  it("should return 200 when password matches", async () => {
    // stubbing user
    findOneStub = sinon.stub(User, "findOne");
    findOneStub.withArgs({ username: "randomuser" }).resolves({
      username: "randomuser",
      password: "hashedpassword", // Assuming this is the hashed password in your database
    });

    // stubbing bcrypt compare verification
    bcryptCompareStub = sinon.stub(bcrypt, "compare");
    bcryptCompareStub.resolves(true);

    // stubbing jwt.sign
    jwtSignStub.returns("mockedToken");

    // send request with correct password
    const res = await request(app)
      .post("/log-in")
      .send({ username: "randomuser", password: "hashedpassword" });

    assert.strictEqual(res.status, 200);
    assert.deepEqual(res.body, { token: "mockedToken" });
  });
});

// *** sign-up *** //

describe("POST /sign-up", () => {
  after(async () => {
    // Close the connection to the in-memory database
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clean up the database before each test
    await User.deleteMany({});
  });

  it("should create a new user when valid data is provided", async () => {
    const response = await request(app)
      .post("/sign-up")
      .send({ username: "testuser", password: "testpass" });

    assert.equal(
      response.status,
      201,
      "Status code should be 201 when user is created",
    );
    assert.equal(response.text, "User created\n");
  });

  it("should return 400 if username or password is missing", async () => {
    const response = await request(app)
      .post("/sign-up")
      .send({ username: "testuser" });

    assert.equal(
      response.status,
      400,
      "Status code should be 400 when username or password is missing",
    );
    assert.equal(response.text, "Username and password are required\n");
  });

  it("should return 409 if username already exists", async () => {
    await new User({ username: "testuser", password: "testpass" }).save();

    const response = await request(app)
      .post("/sign-up")
      .send({ username: "testuser", password: "newpass" });

    assert.equal(
      response.status,
      409,
      "Status code should be 409 when username already exists",
    );
    assert.equal(
      response.text,
      "Username already exists choose another username\n",
    );
  });
});
