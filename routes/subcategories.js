import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all subcategories or filter by categoryId
router.get("/", async (req, res) => {
	try {
		const categoryId = req.query.categoryId;

		let query = "SELECT * FROM treatment_subcategories";
		let params = [];

		if (categoryId) {
			query += " WHERE category_id = ?";
			params.push(categoryId);
		}

		const [subcategories] = await db.query(query, params);
		res.json(subcategories);
	} catch (err) {
		console.error("Error fetching subcategories:", err);
		res.status(500).json({ message: "Internal server error" });
	}
});

export default router;