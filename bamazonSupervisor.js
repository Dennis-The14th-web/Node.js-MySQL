// DEPENDENCIES

var inquirer = require('inquirer');
var Product = require('./product').Product;
var connection = require('./databaseConnection').connection;
var color = require('colors');

// USER INTERACTION

var workspace = {

  // List a set of menu options:
  selectAction: function() {
    inquirer.prompt({
      type: 'list',
      message: 'Managerial Activities:',
      name: 'selectedAction',
      choices: ['View Product Sales By Department', 'Create New Department']
    }).then(function(userData){
      switch(userData.selectedAction) {
        case 'View Product Sales By Department': 
          database.salesByDepartment();
          break;
        case 'Create New Department': 
          workspace.addWhichDepartment();
          break;
        default:
          database.salesByDepartment();
      }
    })
  }, 

  addWhichDepartment: function() {
    inquirer.prompt([
    {
      type: 'input',
      message: 'Enter the department name',
      name: 'department_name'
    },
    {
      type: 'input',
      message: 'Enter the department overhead costs',
      name: 'overhead_costs'
    }
    ]).then(function(userData){
      database.createNewDepartment(userData);
    })
  }, 

  checkContinue: function() {
    inquirer.prompt({
      type: 'confirm',
      message: 'Would you like to perform another transaction?',
      name: 'continue'
    }).then(function(userData){
      if(userData.continue === true){
        workspace.selectAction();
      } else {
        console.log(color.bgBlue('\nExit Manager Activities.\n'));
      }
    });
  }
};

var database = {
  salesByDepartment: function() {
    // get sales for each department
     // use alias to calculate profits from overhead - total salesinstead of storing 
    connection.query('SELECT *, total_sales - overhead_costs as profit FROM departments', function(error, result) {
      if (error) {
        console.log(error);
      } else {
        var deptsArr = result;
        displayTable.departmentSales(deptsArr);
      }
    });
  }, 

  createNewDepartment: function(department) {
    connection.query(
      `INSERT INTO departments (
        department_name, 
        overhead_costs
      ) VALUES
        (?,?);
      `, [department.department_name, department.overhead_costs], function(error, result){
        if(error) {
          console.log(error);
        } else {
          // get id it was inserted to and add it to the object
          var insertId = result.insertId;
          department.department_id = insertId;
          console.log(color.bgBlue('\nDepartment add: successful!\n'));
          displayTable.newDepartment(department);
        }
      });
  }
}

var displayTable = {
  departmentSales: function(deptsArr) {
    console.table(deptsArr);
    workspace.checkContinue();
  },

  newDepartment: function(department) {
    console.table[department];
    workspace.checkContinue();
  }
}

workspace.selectAction();