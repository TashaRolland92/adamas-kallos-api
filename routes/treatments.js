import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all treatments
router.get("/", async (req, res) => {
	try {
		const [treatments] = await db.query(`
			SELECT t.id, t.name, t.description, c.name AS category, s.name AS subcategory
			FROM treatments t
			LEFT JOIN treatment_categories c ON t.category_id = c.id
			LEFT JOIN treatment_subcategories s ON t.subcategory_id = s.id
		`);
		res.json(treatments);
	} catch (err) {
		console.error("Error fetching treatments:", err);
		res.status(500).json({ message: "Internal server error" });
	}
});

// Get a single treatment
router.get("/:treatment_id", async (req, res) => {
	try {
		const { treatment_id } = req.params;
		const [treatment] = await db.query("SELECT * FROM treatments WHERE id = ?", [treatment_id]);

		if (treatment.length === 0) return res.status(404).json({ message: "Treatment not found" });

		res.json(treatment[0]);
	} catch (err) {
		console.error("Error fetching treatment:", err);
		res.status(500).json({ message: "Internal server error" });
	}
});

export default router;