import express from 'express';
import verifyToken from '../middleware/auth.js';
import bookingRoutes from './bookings.js';
import db from '../db.js';

const router = express.Router();

// Protected route to get user account info
router.get('/', verifyToken, async (req, res) => {
	try {
		const [user] = await db.query('SELECT id, name, email, phone, dob FROM users WHERE id = ?', [req.user.id]);

		if (user.length === 0) {
			return res.status(404).json({ message: 'User not found' });
		}

		res.json(user[0]);
	} catch (err) {
		console.error('Error fetching account info:', err);
		res.status(500).json({ message: 'Internal server error' });
	}
});

// Nest the booking routes
router.use('/bookings', bookingRoutes);


export default router;