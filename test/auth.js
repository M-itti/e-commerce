const request = require("supertest");
const express = require("express");
const chai = require("chai");
const sinon = require("sinon");
const { assert } = chai;

const userService = require("../routes/userService");

let registerUserStub = sinon.stub(userService, "registerUser");

const app = express();
app.use(express.json());

const router = require("../routes/auth");
app.use("/", router);

describe("POST /sign-up", () => {
  beforeEach(() => {});

  afterEach(() => {
    registerUserStub.reset();
    registerUserStub.restore();
  });

  it("should return 201 when user is successfully created", async () => {
    registerUserStub.resolves({ username: "testuser" });
    const response = await request(app).post("/sign-up").send({
      username: "testuser",
      password: "testpassword",
    });

    assert.equal(response.status, 201);
    assert.equal(response.text, "User created\n");
  });

  it("should return 409 if username already exists", async function () {
    registerUserStub.rejects(new Error("Username already exists"));

    const response = await request(app).post("/sign-up").send({
      username: "testuser",
      password: "testpassword",
    });

    assert.equal(response.status, 409);
    assert.equal(response.text, "Username already exists\n");
  });

  it("should return 400 when both username and password are missing", async function() {
      registerUserStub.rejects(new Error("Username and password are required"));

      const response = await request(app).post("/sign-up").send({
          username: "",
          password: "",
      });
      assert.equal(response.status, 400);
      assert.equal(response.text, "Username and password are required\n");
  });

  it("should return 400 when username is missing", async function() {
      registerUserStub.rejects(new Error("Username and password are required"));

      const response = await request(app).post("/sign-up").send({
          username: "",
          password: "password123",
      });
      assert.equal(response.status, 400);
      assert.equal(response.text, "Username and password are required\n");
  });

  it("should return 400 when password is missing", async function() {
      registerUserStub.rejects(new Error("Username and password are required"));

      const response = await request(app).post("/sign-up").send({
          username: "testuser",
          password: "",
      });
      assert.equal(response.status, 400);
      assert.equal(response.text, "Username and password are required\n");
  });

  it("should return 400 when both fields are null", async function() {
      registerUserStub.rejects(new Error("Username and password are required"));

      const response = await request(app).post("/sign-up").send({
          username: null,
          password: null,
      });
      assert.equal(response.status, 400);
      assert.equal(response.text, "Username and password are required\n");
  });

  it("should return 400 when username is missing (undefined)", async function() {
      registerUserStub.rejects(new Error("Username and password are required"));

      const response = await request(app).post("/sign-up").send({
          password: "password123",
      });
      assert.equal(response.status, 400);
      assert.equal(response.text, "Username and password are required\n");
  });

  it("should return 400 when password is missing (undefined)", async function() {
      registerUserStub.rejects(new Error("Username and password are required"));

      const response = await request(app).post("/sign-up").send({
          username: "testuser",
      });
      assert.equal(response.status, 400);
      assert.equal(response.text, "Username and password are required\n");
  });
});
