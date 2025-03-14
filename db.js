import mysql from 'mysql2/promise';

const db = await mysql.createConnection({
    host: 'localhost',      // Or your MySQL host
    user: 'root',           // Your MySQL username
    password: 'BlueDiamond123#',  // Your MySQL password
    database: 'adamas_kallos_db' // Your DB name
});

export default db;