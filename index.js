import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import categoriesRoutes from './routes/categories.js';
import subcategoriesRoutes from './routes/subcategories.js';
import treatmentRoutes from './routes/treatments.js';

dotenv.config();
const app = express();
const port = 3000;

// CORS fix
app.use(cors());

// Middleware to parse JSON requests
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/categories', categoriesRoutes);
app.use('/api/subcategories', subcategoriesRoutes);
app.use('/api/treatments', treatmentRoutes);


// Start the server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});