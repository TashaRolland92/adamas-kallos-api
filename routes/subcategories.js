import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all subcategories
router.get("/", async (req, res) => {
	try {
		const [subcategories] = await db.query("SELECT * FROM treatment_subcategories");
		res.json(subcategories);
	} catch (err) {
		console.error("Error fetching subcategories:", err);
		res.status(500).json({ message: "Internal server error" });
	}
});

export default router;