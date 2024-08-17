import process from 'node:process';
import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import 'dotenv/config';

import { User } from "./model.mjs";

const router = express.Router();

const jwt_secret_key = process.env.JWT_SECRET_KEY;

export const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).send('Access Denied: No Token Provided\n');
    }

    jwt.verify(token, jwt_secret_key, (err, user) => {
        if (err) {
            return res.status(403).send('Access Denied: Invalid Token\n');
        }

        req.user = user; // Attach the user object to the request
        next(); // Move to the next middleware or route handler
    });
}

router.post('/sign-up', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send('Username and password are required\n');
        }

        // Check if the username already exists in the database
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(409).send('Username already exists choose another usernmae\n');
        }

        // Hash the password for storing in the database
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create and save the user to the database
        const user = new User({
            username,
            password: hashedPassword
        });

        await user.save();

        res.status(201).send('User created\n');
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error\n');
    }
});

router.post('/log-in', async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).send('Username and password are required\n');
        }

        // Find the user by username
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).send('Invalid credentials\n');
        }

        // Compare the provided password with the hashed password
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).send('Invalid credentials\n');
        }

        const token = jwt.sign(
            { userId: user._id, username: user.username },
            jwt_secret_key, 
            { expiresIn: '1h' } 
        );

        res.json({ token });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error\n');
    }
});

export default router;
