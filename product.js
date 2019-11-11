// DEPENDENCIES

var color = require('colors');

// CONSTRUCTOR

var Product = function(productObj) {
  this.id = productObj.item_id;
  this.name = productObj.product_name;
  this.dept = productObj.department_name;
  this.price = productObj.price;
  this.quantity = productObj.stock_quantity
};

Product.prototype.displayItemToCustomer = function() {
  console.log('\n' + 
            color.magenta.bold(this.id) +
            '\t' + 
            color.cyan.bold(this.name) + 
            '\t' + 
            color.green.bold(this.price));
}

Product.prototype.displayItemToManager = function() {
  console.log('\n' + 
            color.magenta.bold(this.id)+
            '\t' + 
            color.cyan.bold(this.name) + 
            '\t' + 
            color.green.bold(this.price) + 
            '\t' + 
            color.yellow.bold(this.quantity));
}

module.exports = {
  Product: Product
}