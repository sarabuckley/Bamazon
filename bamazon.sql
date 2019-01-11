DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
item_id integer not null auto_increment,
product_name varchar(75) not null,
department_name varchar(50),
price decimal(10,2),
stock_quantity integer(11),
primary key(item_id))auto_increment=1000;

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ('Exploding Kittens Card Game', 'Toys and Games', 15.99, 120);
INSERT INTO products(product_name, department_name, price, stock_quantity) 
VALUES('Kangaroo Emergency Thermal Blankets (Pack of 10)', 'Sports and Outdoors', 7.95, 2661);
INSERT INTO products(product_name, department_name, price, stock_quantity) 
VALUES('Unstable Unicorns Base Game', 'Toys and Games', 20.00, 218);
INSERT INTO products(product_name, department_name, price, stock_quantity) 
VALUES('Kikkerland Cat Butt Magnets, Set of 6 (MG53)', 'Home and Kitchen', 10.95, 848);
INSERT INTO products(product_name, department_name, price, stock_quantity) 
VALUES('Green Eggs and Ham', 'Books', 8.77, 4);
INSERT INTO products(product_name, department_name, price, stock_quantity) 
VALUES('Sylvester and the Magic Pebble', 'Books', 9.99, 221);
INSERT INTO products(product_name, department_name, price, stock_quantity) 
VALUES('DEWALT DWE6421K Random Orbit Sander Kit, 5"', 'Tools and Home Improvement', 59.00, 341);
INSERT INTO products(product_name, department_name, price, stock_quantity) 
VALUES('PowerLix Milk Frother', 'Home and Kitchen', 14.99, 3709);
INSERT INTO products(product_name, department_name, price, stock_quantity) 
VALUES('YGS Stainless Steel Soap', 'Home and Kitchen', 1.79, 3);
INSERT INTO products(product_name, department_name, price, stock_quantity) 
VALUES('Woodstock Chimes, Large, Silver Tubes', 'Lawn and Garden', 32.45, 2054);
