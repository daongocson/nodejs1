const sql = require('mssql');
require('dotenv').config();
const sqlConfig = {
    user: 'sa',
    password: '123@lrco',
    server: '192.168.8.21', // You can use 'localhost\\instance' to connect to named instance
    database: 'His_xml',
    options: {
        encrypt: false, // Disable SSL/TLS
      },   
}
const connsql = new sql.ConnectionPool(sqlConfig).connect().then(pool=>{
    return pool;
}) ;
module.exports = {sqlConfig,sql};