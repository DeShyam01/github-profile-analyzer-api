const mysql = require('mysql2/promise');
const fs = require('fs')
const path = require('path');
require('dotenv').config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

async function initDB(){
    try{
        const sql = fs.readFileSync(
            path.join(__dirname, '../../schema.sql'),
            'utf8'
        );
        await pool.query(sql);
        console.log('Database initialized successfully');
    }catch(err){
        console.error('Error initializing database:', err);
    }
}

initDB();

module.exports = pool;