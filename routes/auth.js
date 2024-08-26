const process = require("process");
const express = require("express");
require("dotenv").config();

const { User } = require("./model");
const { registerUser } = require("./userService");
const authenticateUser = require("./authService");
const authenticateToken = require("./tokenMiddleware");

const router = express.Router();

const jwt_secret_key = process.env.JWT_SECRET_KEY;

router.post("/sign-up", async (req, res) => {
  try {
    const { username, password } = req.body;
    await registerUser(username, password);

    res.status(201).send("User created\n");
  } catch (error) {
    if (error.message === "Username and password are required") {
      return res.status(400).send(error.message + "\n");
    }
    if (error.message === "Username already exists") {
      return res.status(409).send(error.message + "\n");
    }
    console.error(error);
    res.status(500).send("internal server error\n");
  }
});

router.post("/log-in", async (req, res) => {
  try {
    const { username, password } = req.body;
    const token = await authenticateUser(username, password);

    return res.status(200).json({ token });
  } catch (error) {
    if (error.message === "Username and password are required") {
      return res.status(400).send(error.message + "\n");
    }
    if (error.message === "Invalid credentials") {
      return res.status(401).send(error.message + "\n");
    }
    console.error(error);
    res.status(500).send("Internal server error\n");
  }
});

module.exports = router;
