var mysql = require("mysql");
var table = require("console.table");
var inquirer = require("inquirer");

// create the connection information for the sql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "blackbird",
  database: "bamazon"
});

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  //console.log('connected!');

  process.on('unhandledRejection', (reason,p) => {
    console.log('Unhandled Rejections at: Promise', p, 'reason:', reason);

  });
  // first display all items in stock
  displayItems();

});

// function to display existing products in database
function displayItems() {
    //console.log(displayItems);
    var queryStr = "SELECT item_id, product_name, format(price,2) as 'price', stock_quantity as 'in stock' from products";
    connection.query(queryStr, function(err, data) {
      if (err) throw err;

      console.log(" ");
      console.log("         BAMAZON - everything for everyone!");
      console.log("--------------------------------------------------------------------------");
      console.table(data);
      console.log("--------------------------------------------------------------------------\n");

      orderItems();

    });
}

function orderItems() {
  //console.log(orderItems);
  // prompt for info about the item 
  inquirer
    .prompt([
      {
        type: "input",
        name: "id",
        message: "What is the id of the product you would like to buy?",
        validate: validateInput,
        filter: Number
      },
      {
        type: "input",
        name: "quantity",
        message: "How many units of the product are needed?",
        validate: validateInput,
        filter: Number
      }
    ])
    .then(function(input) {
      

      var itemID = input.id;
      var quantityRequested = input.quantity;
      //console.log("item: " + item);
      //console.log("quantity: " + quantity);

      var queryStr = "SELECT * FROM products WHERE ?";
      connection.query(queryStr, {item_id: itemID}, function(err, data) {
          if (err) throw err;

          if (data.length === 0) {

            console.log("\n---------------------------------------------------------")
            console.log("*** Item ID " + itemID + " is invalid. Please select a valid Item ID.");
            console.log("---------------------------------------------------------\n");
            ask();
          
          } else {

            var itemData = data[0];

            if (quantityRequested <= itemData.stock_quantity) {
                
                var updateQueryStr = "UPDATE products SET stock_quantity = " + (itemData.stock_quantity - quantityRequested) + " WHERE item_id = " + itemID;
                
                connection.query(updateQueryStr, function(err,data) {
                  if (err) throw err;

                  var totalCharge = (quantityRequested * itemData.price).toFixed(2);
                  console.log("\n-----------------------------------------------------------------");
                  console.log(" You have ordered: " + itemData.product_name + " x " + quantityRequested);
                  console.log(" This amount will be charged to your account: $" + totalCharge);
                  console.log(" Thank you for using Bamazon!");
                  console.log("-----------------------------------------------------------------\n");
                  ask();
                });

            } else {

              console.log("\n---------------------------------------------------------")
              console.log("*** Insufficient quantities of that product available.")
              console.log("*** Only " + itemData.stock_quantity + " in stock. Please modify your order.");
              console.log("---------------------------------------------------------\n")
              //displayItems();
              ask();
            }        
          }
      });  
  });
}    
  
function ask() {
        inquirer.prompt ([{
          name: "decision",
          type: "confirm",
          default: true,
          message: "Press 'Y' if you wish to order more items; 'n' to exit."
         }])
          .then(function(response) {
              if (response.decision) {
                displayItems();
              } else {
                connection.end();  
              }
        });
}

// validateInput makes sure that the user is supplying only positive integers for their inputs
function validateInput(value) {
  var integer = Number.isInteger(parseFloat(value));
  var sign = Math.sign(value);

  if (integer && (sign === 1)) {
    return true;
  } else {
    return 'Please enter a whole non-zero number.';
  }
}
