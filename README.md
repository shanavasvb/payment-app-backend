# Payment Collection App - Backend API

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18-000000.svg)](https://expressjs.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-4479A1.svg)](https://www.mysql.com/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A robust RESTful API service built with Node.js and Express for managing customer loan portfolios, processing EMI payments, and tracking payment history. Designed for high-performance financial transaction processing with comprehensive error handling and data validation.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Database Schema](#database-schema)
- [Deployment](#deployment)
- [Security](#security)
- [Monitoring](#monitoring)
- [Troubleshooting](#troubleshooting)

## 🎯 Overview

The Payment Collection Backend API provides a complete solution for financial institutions to manage personal loan portfolios and process EMI payments. Built with enterprise-grade reliability and scalability in mind, it offers secure transaction processing with ACID compliance through MySQL transactions.

### Key Capabilities

- **Customer Management**: CRUD operations for customer loan records
- **Payment Processing**: Secure EMI payment collection with validation
- **Transaction History**: Complete audit trail of all payment transactions
- **Real-time Updates**: Automatic EMI due calculation and balance updates
- **Error Handling**: Comprehensive error management with detailed logging
- **Data Integrity**: Database transactions ensure consistency

## ✨ Features

### Core Functionality

- **🏦 Customer Loan Management**
  - Retrieve all customer loan portfolios
  - Query individual customer details by account number
  - Track loan terms, interest rates, and tenure
  - Real-time EMI due calculations

- **💰 Payment Processing**
  - Secure payment submission with validation
  - Automatic EMI balance updates
  - Transaction rollback on failures
  - Payment confirmation with receipt details

- **📊 Payment History**
  - Complete transaction history per customer
  - Payment status tracking (completed/pending/failed)
  - Chronological payment records
  - Audit trail for compliance

### Technical Features

- **Database Connection Pooling**: Optimized MySQL connections
- **Transaction Management**: ACID-compliant payment processing
- **Input Validation**: Comprehensive request validation
- **Error Handling**: Detailed error responses with proper HTTP status codes
- **CORS Support**: Cross-origin resource sharing enabled
- **Health Checks**: API health monitoring endpoint
- **Logging**: Structured logging for debugging and monitoring

## 🛠️ Technology Stack

### Backend Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 18.x | JavaScript runtime |
| Express.js | 4.18.2 | Web application framework |
| MySQL | 8.0 | Relational database |
| mysql2 | 3.6.0 | MySQL client with Promise support |

### Additional Packages

- **cors** (2.8.5): Cross-origin resource sharing
- **dotenv** (16.3.1): Environment variable management
- **nodemon** (3.0.1): Development auto-reload

### Production Tools

- **PM2**: Process manager for Node.js
- **Nginx**: Reverse proxy and load balancer
- **MySQL**: Production database server

## 🏗️ Architecture

### Project Structure

```
payment-backend/
├── server.js              # Main application entry point
├── schema.sql            # Database schema and seed data
├── package.json          # Dependencies and scripts
├── .env                  # Environment configuration (not in git)
├── .env.example          # Environment template
├── .gitignore           # Git ignore rules
├── README.md            # This file
│
├── .github/
│   └── workflows/
│       └── deploy.yml   # CI/CD pipeline configuration
│
└── logs/                # Application logs (not in git)
    └── app.log
```

### System Architecture

```
┌─────────────┐
│  React      │
│  Native App │
└──────┬──────┘
       │ HTTP/JSON
       ▼
┌─────────────┐
│   Nginx     │ (Optional)
│   :80       │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Express.js │
│  API :3000  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   MySQL     │
│   :3306     │
└─────────────┘
```

### Request Flow

1. **Client Request** → API endpoint (e.g., POST /payments)
2. **Validation** → Request body and parameters validated
3. **Database Query** → SQL queries with connection pooling
4. **Transaction** → ACID-compliant database transaction
5. **Response** → JSON response with appropriate HTTP status
6. **Error Handling** → Errors caught and logged with details

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v16.x or higher ([Download](https://nodejs.org/))
- **MySQL**: v8.0 or higher ([Download](https://dev.mysql.com/downloads/))
- **npm**: v7.x or higher (comes with Node.js)
- **Git**: Latest version ([Download](https://git-scm.com/))

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/payment-collection-backend.git
   cd payment-collection-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup environment variables**

   ```bash
   cp .env.example .env
   nano .env
   ```

   Configure the following:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=your_secure_password
   DB_NAME=payment_collection
   NODE_ENV=development
   ```

4. **Setup database**

   ```bash
   # Login to MySQL
   mysql -u root -p

   # Create database and tables
   source schema.sql

   # Verify tables created
   USE payment_collection;
   SHOW TABLES;
   ```

5. **Start the server**

   **Development mode:**
   ```bash
   npm run dev
   ```

   **Production mode:**
   ```bash
   npm start
   ```

6. **Verify installation**

   ```bash
   curl http://localhost:3000/health
   ```

   Expected response:
   ```json
   {
     "status": "OK",
     "timestamp": "2024-12-17T10:30:00.000Z"
   }
   ```

## 📚 API Documentation

### Base URL

```
Development: http://localhost:3000
Production:  http://13.201.81.124:3000
```

### Authentication

Currently, the API does not require authentication. In production, implement JWT or API key authentication.

---

### Endpoints

#### Health Check

```http
GET /health
```

Check API server status.

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2024-12-17T10:30:00.000Z"
}
```

---

#### Get All Customers

```http
GET /customers
```

Retrieve all customer loan portfolios.

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "account_number": "ACC001",
      "customer_name": "John Doe",
      "issue_date": "2023-01-15",
      "interest_rate": 8.50,
      "tenure": 24,
      "emi_due": 5000.00,
      "total_loan_amount": 100000.00
    }
  ]
}
```

**Status Codes:**
- `200 OK`: Successful retrieval
- `500 Internal Server Error`: Database error

---

#### Get Customer by Account Number

```http
GET /customers/:account_number
```

Retrieve details for a specific customer.

**Parameters:**
- `account_number` (path): Customer account number

**Example:**
```bash
curl http://localhost:3000/customers/ACC001
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "account_number": "ACC001",
    "customer_name": "John Doe",
    "issue_date": "2023-01-15",
    "interest_rate": 8.50,
    "tenure": 24,
    "emi_due": 5000.00,
    "total_loan_amount": 100000.00
  }
}
```

**Status Codes:**
- `200 OK`: Customer found
- `404 Not Found`: Customer not found
- `500 Internal Server Error`: Database error

---

#### Submit Payment

```http
POST /payments
```

Process a customer EMI payment.

**Request Body:**
```json
{
  "account_number": "ACC001",
  "payment_amount": 5000.00
}
```

**Validation Rules:**
- `account_number`: Required, must exist in database
- `payment_amount`: Required, must be greater than 0

**Example:**
```bash
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{"account_number":"ACC001","payment_amount":5000}'
```

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "payment_id": 123,
    "account_number": "ACC001",
    "payment_amount": 5000.00,
    "remaining_due": 0.00
  }
}
```

**Status Codes:**
- `200 OK`: Payment successful
- `400 Bad Request`: Invalid input
- `404 Not Found`: Customer not found
- `500 Internal Server Error`: Payment processing error

**Error Response:**
```json
{
  "success": false,
  "message": "Customer account not found"
}
```

---

#### Get Payment History

```http
GET /payments/:account_number
```

Retrieve complete payment history for a customer.

**Parameters:**
- `account_number` (path): Customer account number

**Example:**
```bash
curl http://localhost:3000/payments/ACC001
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "payment_date": "2024-01-15T10:30:00.000Z",
      "payment_amount": 5000.00,
      "status": "completed",
      "customer_name": "John Doe"
    },
    {
      "id": 2,
      "payment_date": "2024-02-15T11:45:00.000Z",
      "payment_amount": 5000.00,
      "status": "completed",
      "customer_name": "John Doe"
    }
  ]
}
```

**Status Codes:**
- `200 OK`: Successful retrieval (empty array if no payments)
- `500 Internal Server Error`: Database error

---

### Error Handling

All endpoints follow a consistent error response format:

```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

## 🗄️ Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐           ┌─────────────────┐
│   customers     │           │    payments     │
├─────────────────┤           ├─────────────────┤
│ id (PK)         │◄──────────┤ customer_id(FK) │
│ account_number  │           │ id (PK)         │
│ customer_name   │           │ account_number  │
│ issue_date      │           │ payment_date    │
│ interest_rate   │           │ payment_amount  │
│ tenure          │           │ status          │
│ emi_due         │           │ created_at      │
│ total_loan_amt  │           └─────────────────┘
│ created_at      │
│ updated_at      │
└─────────────────┘
```

### Customers Table

```sql
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
```

### Payments Table

```sql
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
```

### Sample Data

The schema includes 5 sample customers and payment records for testing:
- Account numbers: ACC001 through ACC005
- Various loan amounts, tenures, and interest rates
- Historical payment records

## 🌐 Deployment

### AWS EC2 Production Deployment

#### Server Specifications

- **Platform**: AWS EC2 Ubuntu 20.04 LTS
- **Instance Type**: t2.micro / t2.small
- **Region**: ap-south-1 (Mumbai)
- **Public IP**: 13.201.81.124
- **Security Group**: Ports 22, 80, 3000, 3306

#### Deployment Steps

1. **Connect to EC2 Instance**

   ```bash
   ssh -i your-key.pem ubuntu@13.201.81.124
   ```

2. **Install Node.js**

   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt install -y nodejs
   node --version
   ```

3. **Install MySQL**

   ```bash
   sudo apt update
   sudo apt install mysql-server -y
   sudo mysql_secure_installation
   ```

4. **Clone and Setup Application**

   ```bash
   git clone https://github.com/yourusername/payment-collection-backend.git
   cd payment-collection-backend
   npm install --production
   ```

5. **Configure Environment**

   ```bash
   nano .env
   ```

   Production configuration:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=production_user
   DB_PASSWORD=strong_password_here
   DB_NAME=payment_collection
   NODE_ENV=production
   ```

6. **Setup Database**

   ```bash
   sudo mysql -u root -p < schema.sql
   ```

7. **Install PM2 Process Manager**

   ```bash
   sudo npm install -g pm2
   pm2 start server.js --name payment-api
   pm2 startup systemd
   pm2 save
   ```

8. **Configure Nginx (Optional)**

   ```bash
   sudo apt install nginx -y
   sudo nano /etc/nginx/sites-available/payment-api
   ```

   Nginx configuration:
   ```nginx
   server {
       listen 80;
       server_name 13.201.81.124;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

   Enable site:
   ```bash
   sudo ln -s /etc/nginx/sites-available/payment-api /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl restart nginx
   ```

9. **Configure Firewall**

   ```bash
   sudo ufw allow 22
   sudo ufw allow 80
   sudo ufw allow 3000
   sudo ufw enable
   ```

10. **Verify Deployment**

    ```bash
    curl http://13.201.81.124:3000/health
    curl http://13.201.81.124:3000/customers
    ```

### CI/CD Pipeline

GitHub Actions workflow for automated deployment:

```yaml
name: Deploy to EC2

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to EC2
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.EC2_HOST }}
          username: ${{ secrets.EC2_USERNAME }}
          key: ${{ secrets.EC2_SSH_KEY }}
          script: |
            cd /home/ubuntu/payment-collection-backend
            git pull origin main
            npm install --production
            pm2 restart payment-api
```

**Required GitHub Secrets:**
- `EC2_HOST`: 13.201.81.124
- `EC2_USERNAME`: ubuntu
- `EC2_SSH_KEY`: Private SSH key content

### PM2 Management Commands

```bash
pm2 list                    # View all processes
pm2 logs payment-api        # View logs
pm2 restart payment-api     # Restart application
pm2 stop payment-api        # Stop application
pm2 delete payment-api      # Remove process
pm2 monit                   # Real-time monitoring
```

## 🔒 Security

### Best Practices Implemented

1. **Environment Variables**: Sensitive data in `.env` file
2. **Input Validation**: All user inputs validated
3. **SQL Injection Prevention**: Parameterized queries
4. **Error Handling**: No sensitive data in error responses
5. **CORS Configuration**: Restricted origins in production

### Recommended Enhancements

```javascript
// Add rate limiting
const rateLimit = require('express-rate-limit');
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/payments', limiter);

// Add helmet for security headers
const helmet = require('helmet');
app.use(helmet());

// Add request logging
const morgan = require('morgan');
app.use(morgan('combined'));

// Add JWT authentication
const jwt = require('jsonwebtoken');
// Implement auth middleware
```

## 📊 Monitoring

### Health Check Endpoint

```bash
curl http://13.201.81.124:3000/health
```

### PM2 Monitoring

```bash
pm2 monit              # Real-time monitoring
pm2 list               # Process list with status
pm2 logs payment-api   # View application logs
```

### MySQL Monitoring

```bash
# Check active connections
mysql -u root -p -e "SHOW PROCESSLIST;"

# Check database size
mysql -u root -p -e "SELECT table_schema, 
  ROUND(SUM(data_length + index_length) / 1024 / 1024, 2) AS 'Size (MB)' 
  FROM information_schema.tables 
  GROUP BY table_schema;"
```

### Log Files

```bash
# Application logs
pm2 logs payment-api

# Nginx access logs
sudo tail -f /var/log/nginx/access.log

# Nginx error logs
sudo tail -f /var/log/nginx/error.log

# MySQL error log
sudo tail -f /var/log/mysql/error.log
```

## 🐛 Troubleshooting

### Common Issues

#### Database Connection Failed

**Symptoms**: "Database connection failed" error on startup

**Solutions:**
```bash
# Check MySQL status
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql

# Verify credentials in .env
nano .env

# Test connection
mysql -u root -p -e "SELECT 1;"
```

#### Port Already in Use

**Symptoms**: "EADDRINUSE: address already in use :::3000"

**Solutions:**
```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>

# Or change port in .env
PORT=3001
```

#### PM2 Process Crashed

**Symptoms**: PM2 shows "errored" or "stopped" status

**Solutions:**
```bash
# View error logs
pm2 logs payment-api --err

# Restart process
pm2 restart payment-api

# Check for errors in code
npm run dev
```

#### High Memory Usage

**Solutions:**
```bash
# Restart PM2 process
pm2 restart payment-api

# Optimize connection pool in server.js
connectionLimit: 5  // Reduce if necessary
```

### Debug Mode

Enable detailed logging:

```javascript
// Add to server.js
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  console.log('Body:', req.body);
  next();
});
```

## 🧪 Testing

### Manual API Testing

```bash
# Test health endpoint
curl http://localhost:3000/health

# Get all customers
curl http://localhost:3000/customers

# Get specific customer
curl http://localhost:3000/customers/ACC001

# Submit payment
curl -X POST http://localhost:3000/payments \
  -H "Content-Type: application/json" \
  -d '{"account_number":"ACC001","payment_amount":5000}'

# Get payment history
curl http://localhost:3000/payments/ACC001
```

### Using Postman

Import the following collection:

```json
{
  "info": {
    "name": "Payment Collection API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Get All Customers",
      "request": {
        "method": "GET",
        "url": "{{base_url}}/customers"
      }
    },
    {
      "name": "Submit Payment",
      "request": {
        "method": "POST",
        "url": "{{base_url}}/payments",
        "body": {
          "mode": "raw",
          "raw": "{\"account_number\":\"ACC001\",\"payment_amount\":5000}"
        }
      }
    }
  ]
}
```

## 📦 Package.json Scripts

```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "test": "jest",
    "lint": "eslint .",
    "format": "prettier --write ."
  }
}
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Use ES6+ syntax
- Follow ESLint configuration
- Write descriptive commit messages
- Add comments for complex logic
- Update documentation for API changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

