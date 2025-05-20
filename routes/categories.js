import express from 'express';
import db from '../db.js';

const router = express.Router();

// Get all categories
router.get("/", async (req, res) => {
	try {
		const [categories] = await db.query("SELECT * FROM treatment_categories");

		// Map and convert has_subcategories from number to boolean
		const formattedCategories = categories.map(category => ({
			...category,
			has_subcategories: Boolean(category.has_subcategories)
		}));

		res.json(formattedCategories);

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
		const { subcategory_id } = req.query;
		let sql = `
			SELECT
				t.id,
				t.name,
				t.description,
                t.price,
                t.duration,
                t.subcategory_id,
                t.category_id,
				s.name AS subcategory_name
			FROM
				treatments t
			LEFT JOIN
				treatment_subcategories s ON t.subcategory_id = s.id
			WHERE
				t.category_id = ?
		`;

		const params = [category_id];

		if(subcategory_id){
			sql += ` AND t.subcategory_id = ?`;
			params.push(subcategory_id);
		}

		const [treatments] = await db.query(sql, params);

		res.json(treatments);
	} catch (err) {
		console.error("Error fetching treatments:", err);
		res.status(500).json({ message: "Internal server error" });
	}
});