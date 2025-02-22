const mysql = require('mysql2');

// Create a connection pool
const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'school_event_management',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// ✅ Export the pool itself (NO `.promise()` here)
module.exports = pool;
