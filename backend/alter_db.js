require('dotenv').config();
const mysql = require('mysql2/promise');

async function updateDb() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'royalrent'
        });

        console.log("Adding start_date to order_items...");
        try {
            await connection.execute('ALTER TABLE order_items ADD COLUMN start_date DATE');
        } catch(e) {
            console.log(e.message);
        }
        
        console.log("Adding end_date to order_items...");
        try {
            await connection.execute('ALTER TABLE order_items ADD COLUMN end_date DATE');
        } catch(e) {
            console.log(e.message);
        }

        console.log("DB updated successfully!");
        await connection.end();
    } catch (err) {
        console.error("Connection failed:", err);
    }
}

updateDb();
