const mysql = require('mysql2');
require('dotenv').config();

const pool = mysql.createPool({
    host: 'ls-e2029d66e023eb4cf5366724fe912a2e37ded960.czmq42a8qw3q.eu-west-2.rds.amazonaws.com',
    user: 'dbmasteruser',  // Corrected username
    password: 'London1995',  // Keep this secure; consider using environment variables
    database: 'seru',  // Your database name
    port: 3306,  // Ensure correct port
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool.promise();