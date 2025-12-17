-- Create database
CREATE DATABASE IF NOT EXISTS payment_collection;
USE payment_collection;

-- Customers table
CREATE TABLE customers (
  id INT AUTO_INCREMENT PRIMARY KEY,
  account_number VARCHAR(50) UNIQUE NOT NULL,
  customer_name VARCHAR(100) NOT NULL,
  issue_date DATE NOT NULL,
  interest_rate DECIMAL(5, 2) NOT NULL,
  tenure INT NOT NULL COMMENT 'Tenure in months',
  emi_due DECIMAL(10, 2) NOT NULL DEFAULT 0,
  total_loan_amount DECIMAL(12, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_account_number (account_number)
);

-- Payments table
CREATE TABLE payments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  customer_id INT NOT NULL,
  account_number VARCHAR(50) NOT NULL,
  payment_date DATETIME NOT NULL,
  payment_amount DECIMAL(10, 2) NOT NULL,
  status ENUM('completed', 'pending', 'failed') DEFAULT 'completed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
  INDEX idx_customer_id (customer_id),
  INDEX idx_account_number (account_number),
  INDEX idx_payment_date (payment_date)
);

-- Insert data for customers
INSERT INTO customers (account_number, customer_name, issue_date, interest_rate, tenure, emi_due, total_loan_amount) VALUES
('ACC001', 'Alen', '2023-01-15', 8.50, 24, 5000.00, 100000.00),
('ACC002', 'Sachin', '2023-03-20', 9.00, 36, 3500.00, 120000.00),
('ACC003', 'Sharma ', '2023-06-10', 7.75, 48, 2800.00, 150000.00),
('ACC004', 'Aswin', '2023-08-05', 8.25, 60, 4200.00, 200000.00),
('ACC005', 'Steve', '2023-10-12', 9.50, 24, 6000.00, 80000.00);

-- Insert data to payment history
INSERT INTO payments (customer_id, account_number, payment_date, payment_amount, status) VALUES
(1, 'ACC001', '2024-01-15', 5000.00, 'completed'),
(1, 'ACC001', '2024-02-15', 5000.00, 'completed'),
(2, 'ACC002', '2024-01-20', 3500.00, 'completed'),
(3, 'ACC003', '2024-01-10', 2800.00, 'completed'),
(4, 'ACC004', '2024-02-05', 4200.00, 'completed');