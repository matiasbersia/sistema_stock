const mysql = require('mysql2');

const connection = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '12345',
    database: 'sistema_registro_stock'
});

module.exports = connection;