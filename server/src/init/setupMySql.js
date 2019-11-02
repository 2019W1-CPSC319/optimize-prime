require('dotenv').config();
const mysql = require('mysql');

// const connection = mysql.createConnection({
//   host: '127.0.0.1',
//   user: 'root',
//   password: '',
//   database: 'scheduler',
// });



const connection = mysql.createConnection({
  host: 'lasovo.duckdns.org',
  database: 'scheduler',
  user: 'galvanize',
  password: 'galvan1ze',
});

connection.connect((err) => {
  if (!err) {
    console.log('Database is connected.');
  } else {
    console.log(err);
  }
});

module.exports = connection;
