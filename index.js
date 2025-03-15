import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import treatmentsRoutes from './routes/treatments.js';

dotenv.config();
const app = express();
const port = 3000;

// Middleware to parse JSON requests
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/treatments', treatmentsRoutes);


// Start the server
app.listen(port, () => {
	console.log(`Server running at http://localhost:${port}`);
});