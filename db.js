import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const db = await mysql.createConnection({
    host: process.env.DB_HOST,      // Or your MySQL host
	port: process.env.DB_PORT,
    user: process.env.DB_USER,           // Your MySQL username
    password: process.env.DB_PASSWORD,  // Your MySQL password
    database: process.env.DB_NAME // Your DB name
});

export default db;