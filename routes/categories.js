import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all categories
router.get("/", async (req, res) => {
	try {
		const [categories] = await db.query("SELECT * FROM treatment_categories");
		res.json(categories);
	} catch (err) {
		console.error("Error fetching categories:", err);
		res.status(500).json({ message: "Internal server error" });
	}
});

// Get a single category
router.get("/:category_id", async (req, res) => {
	try {
		const { category_id } = req.params;
		const [category] = await db.query("SELECT * FROM treatment_categories WHERE id = ?", [category_id]);

		if (category.length === 0) return res.status(404).json({ message: "Category not found" });

		res.json(category[0]);
	} catch (err) {
		console.error("Error fetching category:", err);
		res.status(500).json({ message: "Internal server error" });
	}
});

// Get subcategories for a category
router.get("/:category_id/subcategories", async (req, res) => {
	try {
		const { category_id } = req.params;
		const [subcategories] = await db.query("SELECT * FROM treatment_subcategories WHERE category_id = ?", [category_id]);

		res.json(subcategories);
	} catch (err) {
		console.error("Error fetching subcategories:", err);
		res.status(500).json({ message: "Internal server error" });
	}
});

// Get treatments in a category (whether it has subcategories or not)
router.get("/:category_id/treatments", async (req, res) => {
	try {
		const { category_id } = req.params;
		const [treatments] = await db.query(`
			SELECT t.id, t.name, t.description, s.name AS subcategory
			FROM treatments t
			LEFT JOIN treatment_subcategories s ON t.subcategory_id = s.id
			WHERE t.category_id = ?
		`, [category_id]);

		res.json(treatments);
	} catch (err) {
		console.error("Error fetching treatments:", err);
		res.status(500).json({ message: "Internal server error" });
	}
});

// Get treatments in a specific subcategory
router.get("/:category_id/subcategories/:subCategory_id/treatments", async (req, res) => {
	try {
		const { category_id, subCategory_id } = req.params;
		const [treatments] = await db.query(`
			SELECT t.id, t.name, t.description
			FROM treatments t
			WHERE t.category_id = ? AND t.subcategory_id = ?
		`, [category_id, subCategory_id]);

		if (treatments.length === 0) return res.status(404).json({ message: "No treatments found in this subcategory" });

		res.json(treatments);
	} catch (err) {
		console.error("Error fetching treatments in subcategory:", err);
		res.status(500).json({ message: "Internal server error" });
	}
});

export default router;