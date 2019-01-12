# Bamazon

## Description

This application implements a simple command-line based storefront. It presents two interfaces: **customer** and **manager**. 
It uses the npm [inquirer](https://www.npmjs.com/package/inquirer) package and the MySQL database backend together with the npm [mysql](https://www.npmjs.com/package/mysql) package. 

### MySQL Database Setup

In order to run this application, you should have the MySQL database already set up on your machine. If you don't, visit the [MySQL installation page](https://dev.mysql.com/doc/refman/5.6/en/installing.html) to install the version you need for your operating system. Once you have MySQL isntalled, you will be able to create the *Bamazon* database and the *products* table with the SQL code found in [bamazon.sql](bamazon.sql). Run this code inside your MySQL client to populate the database. Then you will be ready to proceed with running the Bamazon customer and manager interfaces.

### Customer Interface

The Customer Interface allows the user to view the current inventory of store items and purchase any of the items listed. 

The inventory lists all the data from the *products* table, which consists of  item ID, product name, department in which the item is located and price. The user can then purchase an item by entering the item ID and the desired quantity. If the selected quantity is currently in stock, the user's order is fulfilled, displaying the total purchase price and updating the store database. If the desired quantity is not available, the user is prompted to modify their order. Once the order is completed, the user can place another order or exit the system. 

To run the customer interface please follow the steps below:

    git clone https://github.com/sarabuckley/Bamazon.git
	cd Bamazon
	npm install
	node bamazonCustomer.js

### Manager Interface

The manager interface presents a list of five options: 

	? Please select an option: (Use arrow keys)
	❯ View Products for Sale 
	  View Low Inventory 
	  Add to Inventory 
	  Add New Product
      Exit BIMS
	  
The **View Products for Sale** option allows the user to view the current inventory of store items: item ID, product name, department in which the item is located, price, and the quantity available in stock. 

The **View Low Inventory** option lists all items with and inventory count of less than **5**.

The **Add to Inventory** option allows the user to select a given item ID and add additional inventory to the target item.

The **Add New Product** option allows the user to enter details about a new product which will be added to the database upon completion of the form.

The **Exit BIMS** option allows the user to exit the Bamazon Inventory Management System (BIMS).

To run the manager interface please follow the steps below:

	git clone https://github.com/sarabuckley/Bamazon.git
	cd Bamazon
	npm install
	node bamazonManager.js

### Bamazon Demo

You can watch the demo of the Bamazon customer and manager interfaces at the link below.

[Bamazon Demo](https://drive.google.com/open?id=1CZ-leV1gSUBrLjpaSrOOcklg-irJ_CMS)
