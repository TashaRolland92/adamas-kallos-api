import express from 'express';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';
import db from '../db.js';

dotenv.config(); // load env variables
const router = express.Router();

// Register route with validation and password hashing
router.post('/register', async (req, res) => {
    const { name, email, password, phone, dob } = req.body;

	// Validate required input
    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

	try {

		// Check if email already exists
		const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

		if (existingUser.length > 0) {
            return res.status(400).json({ message: 'Email already registered' });
        }

		// Hash the password
		const hashedPassword = await bcrypt.hash(password, 10);

		// Insert user into database
		const [result] = await db.query(
			'INSERT INTO users (name, email, password, phone, dob) VALUES (?, ?, ?, ?, ?)',
			[name, email, hashedPassword, phone, dob]
		);

		res.status(201).json({
			message: 'User registered successfully',
			userId: result.insertId
		});

	} catch (err) {
		console.error('Error registering user:', err);
		res.status(500).json({
			message: 'Internal server error',
			error: err.message
		});
	}
});

// Login route
router.post('/login', async (req, res) => {
	const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please fill in all fields' });
    }

	try {
		// Check if user exists
		const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

		if (users.length === 0) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

		const user = users[0];

		// Compare the provided password with the hashed password
		const passwordMatch = await bcrypt.compare(password, user.password);

		if (!passwordMatch) {
			return res.status(400).json({ message: 'Invalid email or password' });
		}

		// Create a JWT token
		const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
			expiresIn: '1h' // Token expires in 1 hour
		});

		res.status(200).json({
			message: 'Login successful',
			token,
			user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
		});

	} catch (err) {
		console.error('Login error:', err);
        res.status(500).json({
			message: 'Internal server error',
			error: err.message
		});
	}
});

export default router;