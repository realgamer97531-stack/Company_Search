const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'company_search'
});

db.connect((err)=>{
    if(err){
        console.error('MySQL Connection Error:', err.message);
        console.error('Database Config:', {
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            database: process.env.DB_NAME || 'company_search'
        });
        // Retry connection after 5 seconds
        setTimeout(()=>{
            db.connect();
        }, 5000);
    }else{
        console.log('✓ MySQL Connected Successfully');
    }
});

// Handle connection errors after initial connection
db.on('error', (err) => {
    console.error('Database error:', err);
    if(err.code === 'PROTOCOL_CONNECTION_LOST') {
        db.connect();
    }
    if(err.code === 'ER_CON_COUNT_ERROR') {
        db.connect();
    }
    if(err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') {
        db.connect();
    }
});

module.exports = db;