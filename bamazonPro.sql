
USE Bamazon;

# populate products with dummy data
INSERT INTO products (
    product_name,
    department_name,
    price,
    stock_quantity
) VALUES
("floor carpet", "home improvement", 30.67, 76),
("harry potter", "book", 6.99, 120),
("purina beneful", "pet supply", 12.99, 61),
("ramen noodle", "grocery", 3.88, 20),
("calvin klein", "fashion", 67.99, 15),
("baby diaper", "baby", 3.89, 45),
("car battery", "automotive", 49.95, 160)
;

INSERT INTO departments (
    department_name, 
    overhead_costs
) VALUES
("home improvement", 100.00),
("book", 50.00),
("pet supply", 30.00),
("grocery", 300.00),
("fashion", 120.00),
("baby", 20.00),
("automotive", 80.00)