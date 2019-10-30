require('dotenv').config();
const mysql = require('mysql');

// const connection = mysql.createConnection({
//   host: '127.0.0.1',
//   user: 'root',
//   password: '',
//   database: 'scheduler',
// });

const connection = mysql.createConnection({
  host: process.env.MYSQL_HOST,
  database: process.env.MYSQL_DB,
  user: process.env.MYSQL_DB_USERNAME,
  password: process.env.MYSQL_DB_PASSWORD,
});

connection.connect((err) => {
  if (!err) {
    console.log('Database is connected.');
  } else {
    console.log(err);
  }
});

module.exports = connection;
