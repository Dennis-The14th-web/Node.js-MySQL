// DEPENDENCIES

var mysql = require('mysql');

// CONNECTION

var connection = mysql.createConnection({
  host: '192.168.99.100',
  user: 'root', 
  password: 'docker',
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