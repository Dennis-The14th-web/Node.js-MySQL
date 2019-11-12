// DEPENDENCIES

var inquirer = require('inquirer');
var Product = require('./product').Product;
var connection = require('./databaseConnection').connection;
var color = require('colors');  


// USER INTERACTION

var activities = {
  'stockArray': [], 
  'availableIds': [],

  // List a set of menu options:

  selectAction: function() {
    inquirer.prompt({
      type: 'list',
      message: 'You are logged in to the Bamazon Workplace. What would you like to do?',
      name: 'selectedAction',
      choices: ['View Products For Sale', 'View Low Inventory', 'Add to Inventory', 'Add New Product']
    }).then(function(userData){
      switch(userData.selectedAction) {
        case 'View Products For Sale': 
          database.listAllPros(activities.checkContinue);
          break;
        case 'View Low Inventory': 
          database.lowInventoryList(activities.checkContinue);
          break;
        case 'Add to Inventory':
          database.listAllPros(activities.addWhichInventory);

          break;
        case 'Add New Product':
          activities.addWhichPro();
          break;
        default:
          database.listAllPros();
      }
    })
  }, 
  
  // If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
  addWhichInventory: function() {
    inquirer.prompt([
    {
      type: 'input',
      message: 'Enter the item id',
      name: 'itemId',
      validate: function(value) {
        if (value.length && activities.availableIds.indexOf(parseInt(value)) > -1) {
          return true;
        } else {
          console.log(color.red('\nPlease enter the id of an available product'));
          return;
        }
      }
    },
    {
      type: 'input',
      message: 'Enter quantity to add',
      name: 'addQuantity',
      validate: function(value) {
        if (value.length && !isNaN(parseInt(value)) && parseInt(value) > 0) {
          return true;
        } else {
          console.log(color.red('\nQuantity must be a number greater than 0'));
          return;
        }
      }
    }]).then(function(userData){
      database.addStockToInventory(userData.itemId, userData.addQuantity, activities.checkContinue);
    })
  },

  // If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
  addWhichPro: function() {
    inquirer.prompt([
    {
      type: 'input',
      message: 'Enter the item name',
      name: 'product_name'
    },
    {
      type: 'input',
      message: 'Enter the department',
      name: 'department_name'
    },
    {
      type: 'input',
      message: 'Enter the unit price',
      name: 'price'
    },
    {
      type: 'input',
      message: 'Enter the stock quantity to add', 
      name: 'stock_quantity'
    }
    ]).then(function(userData){
      database.addItemToInventory(userData, activities.checkContinue);
    })
  }, 

  checkContinue: function() {
    inquirer.prompt({
      type: 'confirm',
      message: 'Would you like to make another transaction?',
      name: 'continue'
    }).then(function(userData){
      if(userData.continue === true){
        activities.selectAction();
      } else {
        console.log(color.bgMagenta('\nYou have been successfully logged out of the Bamazon activities.\n'));
      }
    });
  }
};

// DATABASE

var database = {
  // list every available item: the item IDs, names, prices, and quantities.
  listAllPros: function(func) {
    connection.query('SELECT * FROM products', function(error, result) {
      if(error) {
        console.log(error);
      } else {
        console.log(color.bgYellow('\nBamazon Workplace - All Products \n'));
        console.log(('id\titem\t\tprice\tquantity'));
        for(var i = 0; i < result.length; i++) {
          var newPro = new Product(result[i]);
          var id = newPro.id;
          activities.availableIds.push(id);
          activities.stockArray.push(newPro);
          newPro.displayItemToManager();
        }

        func(); 
      }
    });
  },

  // list all items with a inventory count lower than five.
  lowInventoryList: function(func) {
    connection.query('SELECT * FROM products WHERE stock_quantity < ?', 5, function(error, result) {
      if(error) {
        console.log(error);
      } else {
        console.log(color.bgRed('\nBamazon Activities - Low Inventory\n'));
        console.log(('id\titem\t\tprice\tquantity'));
        for(var i = 0; i < result.length; i++) {
          var newPro = new Product(result[i]);
          activities.stockArray.push(newPro);
          newPro.displayItemToManager();
        }

        func(); 
      }
    });
  },

  // increase inventory of any item currently in the store.
  addStockToInventory: function(itemId, addQuantity, func) {
    connection.query('UPDATE products SET stock_quantity = (stock_quantity + ?) WHERE item_id = ?', [addQuantity, itemId], function(error, result) {
      if(error){
        console.log(error);
      } else {
        connection.query('SELECT * FROM products WHERE item_id = ?', itemId, function(error, result) {
          if (error) {
            console.log(error);
          } else {
            console.log(color.bgGreen('\nInventory add successful!\n'));
            console.log(('id\titem\t\tprice\tquantity'));
            var updatedPro = new Product(result[0]);
            updatedPro.displayItemToManager();

            func(); 
          }
        });
      }
    });
  },

  //add a completely new product to the store.
  addItemToInventory: function(product, func) {
    connection.query(
      `INSERT INTO products (
        product_name, 
        department_name,
        price,
        stock_quantity
      ) VALUES
      (?, ?, ?, ?);
      `, [product.product_name, product.department_name, product.price, product.stock_quantity], function(error, result) {
        if(error) {
          console.log(error);
        } else {
          // get id it was inserted to and add it to the object 
          var insertId = result.insertId;
          product.item_id = insertId;
          console.log(color.bgGreen('\nProduct add successful!\n'));
          console.log(('id\titem\t\tprice\tquantity'));
          var newPro = new Product(product);
            newPro.displayItemToManager();

          func(); 
        }
      });
  }
};


// INITIALIZE


activities.selectAction();