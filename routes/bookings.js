import express from 'express';
import verifyToken from '../middleware/auth.js';
import db from '../db.js';

const router = express.Router();

// Account -> Bookings route
router.get('/bookings', verifyToken, async (req, res) => {
	try {
		const [bookings] = await db.query(
			'SELECT id, treatment, date, time, status FROM bookings WHERE user_id = ?',
			[req.user.id]
		);

		if (bookings.length === 0) {
			return res.status(404).json({ message: 'No bookings found' });
		}

		res.json(bookings);
	} catch (err) {
		console.error('Error fetching bookings:', err);
		res.status(500).json({ message: 'Internal server error' });
	}
});

// Get bookings
router.get('/', verifyToken, async (req, res) => {
	try {
		const [bookings] = await db.query(
			'SELECT id, treatment, date, time, status FROM bookings WHERE user_id = ?',
			[req.user.id]
		);

		if (bookings.length === 0) {
			return res.status(404).json({ message: 'No bookings found' });
		}

		res.json(bookings);
	} catch (err) {
		console.error('Error fetching bookings:', err);
		res.status(500).json({ message: 'Internal server error' });
	}
});

// Create a new booking
router.post('/', verifyToken, async (req, res) => {
    const { treatment, date, time } = req.body;

    // Validate input
    if (!treatment || !date || !time) {
        return res.status(400).json({ message: 'Please provide treatment, date, and time' });
    }

    try {
        // Insert booking into the database
        const [result] = await db.query(
            'INSERT INTO bookings (user_id, treatment, date, time) VALUES (?, ?, ?, ?)',
            [req.user.id, treatment, date, time]
        );

        res.status(201).json({
            message: 'Booking created successfully',
            bookingId: result.insertId
        });
    } catch (err) {
        console.error('Error creating booking:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Update a booking
router.patch('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { treatment, date, time, status } = req.body;

    try {
        const [result] = await db.query(
            'UPDATE bookings SET treatment = ?, date = ?, time = ?, status = ? WHERE id = ? AND user_id = ?',
            [treatment, date, time, status, id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Booking not found or not authorized' });
        }

        res.json({ message: 'Booking updated successfully' });
    } catch (err) {
        console.error('Error updating booking:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Cancel a booking
router.delete('/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const [result] = await db.query(
            'DELETE FROM bookings WHERE id = ? AND user_id = ?',
            [id, req.user.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Booking not found or not authorized' });
        }

        res.json({ message: 'Booking canceled successfully' });
    } catch (err) {
        console.error('Error canceling booking:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;