require('dotenv').config();
const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'remotemysql.com',
  user: process.env.MYSQL_DB_USERNAME,
  password: process.env.MYSQL_DB_PASSWORD,
  database: process.env.MYSQL_DB_USERNAME,
});

connection.connect((err) => {
  if (!err) {
    console.log('Database is connected.');
  } else {
    console.log(err);
  }
});

module.exports = connection;
