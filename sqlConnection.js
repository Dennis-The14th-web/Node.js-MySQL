// DEPENDENCIES

var mysql = require('mysql');

// CONNECTION

var connection = mysql.createConnection({
  host: 'localhost',
  user: 'root', 
  password: '',
  database: 'Bamazon'
});

connection.connect(function(error){
  if(error){
    console.log(error);
  }
});

module.exports = {
  connection: connection
}