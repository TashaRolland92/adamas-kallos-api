import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
    host: process.env.DB_HOST,      // Or your MySQL host
    user: process.env.DB_USER,           // Your MySQL username
    password: process.env.DB_PASSWORD,  // Your MySQL password
    database: process.env.DB_NAME // Your DB name
});

export default db;