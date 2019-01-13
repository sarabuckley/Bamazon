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

  // first display all items in stock
  mainMenu();

});

// function which prompts the user for what action they should take
function mainMenu() {

  console.log("\n--------------------------------------------------------------------------");
  console.log(" Bamazon Inventory Management System (BIMS)");
  console.log("--------------------------------------------------------------------------\n");

  inquirer
  .prompt({
    name: "action",
    type: "list",
    message: "What BIMS option do you need?",
    choices: [
      " 1. View Products for Sale",
      " 2. View Low Inventory",
      " 3. Add to Inventory",
      " 4. Add New Product",
      " 5. Exit BIMS"
    ]
  })
      .then(function(input) {
        switch (input.action) {
        case " 1. View Products for Sale":
          displayInventory();
          break;
  
        case " 2. View Low Inventory":
          displayLowInventory();
          break;
  
        case " 3. Add to Inventory":
          addInventory();
          break;
  
        case " 4. Add New Product":
          addNewProduct();
          break;
        
        case " 5. Exit BIMS":
          connection.end();
          break;  

        default:
          connection.end();
          return;  
        }
      });
  }
 
// function to display existing products in database
function displayInventory() {
    
    var queryStr = "SELECT item_id, product_name, department_name as 'department', format(price,2) as 'price', stock_quantity as 'in stock' from products";
    connection.query(queryStr, function(err, data) {
      if (err) throw err;

      console.log("\n         BAMAZON - everything for everyone!");
      console.log("------------------------------------------------------------------------------------------------------");
      console.table(data);
      console.log("------------------------------------------------------------------------------------------------------\n");
      ask();

    });
}

function displayLowInventory() {
  
 var queryStr = "SELECT item_id, " +
                "product_name, " +
                "department_name as 'department', " +
                "format(price,2) as 'price', " +
                "stock_quantity as 'in stock' " +
                "FROM products " + 
                "WHERE stock_quantity < 5";
               
    connection.query(queryStr, function(err, data) {
      if (err) throw err;

      console.log("\n         BAMAZON - LOW STOCK");
      console.log("--------------------------------------------------------------------------");
      if (data.length === 0) {
        console.log("\n NO products are currently below a stock quantity of 50.\n");
      } else {
        console.table(data);
      }  
      console.log("--------------------------------------------------------------------------\n");
      ask();
    });
}

function addInventory() {
  
  console.log("\n BIMS - Add to Existing Inventory");
  console.log("-----------------------------------\n");

  inquirer
  .prompt([
    {
      type: "input",
      name: "id",
      message: "Enter item_id of product:",
      validate: validateInput,
      filter: Number
    },
    {
      type: "input",
      name: "quantity",
      message: "Enter quantity of units to add:",
      validate: validateInput,
      filter: Number
    }
  ])
  .then(function(input) {
    

    var itemID = input.id;
    var quantityRequested = input.quantity;

    var queryStr = "SELECT * FROM products WHERE ?";
    connection.query(queryStr, {item_id: itemID}, function(err, data) {
        if (err) throw err;

        if (data.length === 0) {

          console.log("\n---------------------------------------------------------")
          console.log("*** Item ID " + itemID + " is invalid. Please select a valid Item ID.");
          console.log("---------------------------------------------------------\n");
          displayInventory();
        
        } else {

          var itemData = data[0];
          var originalQuantity = itemData.stock_quantity;
          var newQuantity = itemData.stock_quantity + quantityRequested;
          var updateQueryStr = "UPDATE products SET stock_quantity = " + 
                                (newQuantity) + 
                              " WHERE item_id = " + itemID;
          
                              
          connection.query(updateQueryStr, function(err,data) {
            if (err) throw err;

            console.log("\n-----------------------------------------------------------------");
            console.log(" Added to the inventory: " + itemData.product_name + " x " + quantityRequested);
            console.log(" Original Quantity in stock: " +  originalQuantity);
            console.log(" New Quantity in stock: " +  newQuantity);
            console.log("-----------------------------------------------------------------\n");
            ask();

          });   
        }
    });  
  });
}    

function addNewProduct() {

  console.log("\n BIMS - Add New Product to the Inventory");
  console.log("--------------------------------------\n");

  inquirer
    .prompt([
      {
        name: "item",
        type: "input",
        message: "Enter product name: ",
        validate: function(value) {
          if (value === "") {
              return "Product Name not entered";
          } else {
              return true;    
          }
        }  
      },
      {
        name: "department",
        type: "list",
        message: "Check department for this item: ",
        choices: [
            "Books",
            "Clothing",
            "Home and Kitchen",
            "Sports and Outdoors",
            "Tools and Home Improvement",
            "Toys and Games"
          ]
      },
      {
        name: "price",
        type: "input",
        message: "Enter price per unit: ",
        validate: validatePrice
      },    
      {
        name: "quantity",
        type: "input",
        message: "Enter quantity purchased: ",
        validate: validateInput 
      }  
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answer.item,
          department_name: answer.department,
          price: answer.price,
          stock_quantity: answer.quantity
        },
        function(err) {
          if (err) throw err;

          console.log("\n-----------------------------------------------------------------");
          console.log(" New Product Added: " + answer.item);
          console.log(" Department: " + answer.department);
          console.log(" Quantity Added: " + answer.quantity);
          console.log(" Inventory Updated");
          console.log("-----------------------------------------------------------------\n");
        
          // re-prompt the user if they want another option
          ask();
        }
      );
    });
}

function ask() {
  inquirer.prompt ([{
    name: "decision",
    type: "confirm",
    default: true,
    message: "Press 'Y' to stay in BIMS; 'n' to exit."
   }])
    .then(function(response) {
        if (response.decision) {
          mainMenu();
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
      return "Please enter a whole non-zero number.";
  }
}

// validatePrice makes sure that the user is supplying a non-zero numerical value
function validatePrice(value) {

  if (isNaN(parseInt(value)) || Math.sign(value) === 0) {
      return "Please enter a valid non-zero number.";
  } else {
      return true;
  }
}
