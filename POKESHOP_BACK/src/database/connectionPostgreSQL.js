// POKESHOP_BACK/src/database/connectionPostgreSQL.js
import pg from "pg";
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export const pool = new pg.Pool({
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 5432,
    database: process.env.DB_NAME || "pokeshop",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "Faiberman123"
});

// Test database connection
pool.query('SELECT NOW()', (err, res) => {
    if (err) {
        console.error('Database connection error:', err);
    } else {
        console.log('Database connected successfully:', res.rows[0].now);
    }
});