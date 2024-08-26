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
});
