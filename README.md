# Payment Collection App - Backend

A RESTful API backend built with Node.js and Express for managing customer loan payments and EMI collections.

## 🚀 Features

- **Customer Management**: Retrieve customer loan details and account information
- **Payment Processing**: Process payments with automatic EMI due updates
- **Transaction Safety**: Database transactions with rollback support
- **Connection Pooling**: Efficient MySQL connection management
- **Error Handling**: Comprehensive error handling and validation
- **CORS Support**: Cross-origin resource sharing enabled for frontend integration

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js v5
- **Database**: MySQL/MariaDB
- **Database Driver**: mysql2 (with Promises)
- **Environment Management**: dotenv
- **CORS**: cors middleware

## 📁 Project Structure

```
payment-backend/
├── server.js          # Main application file with routes
├── schema.sql         # Database schema and sample data
├── package.json       # Dependencies and scripts
├── .env              # Environment variables (create this)
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## 🗄️ Database Schema

### Customers Table
```sql
- id (INT, Primary Key)
- account_number (VARCHAR(50), Unique)
- customer_name (VARCHAR(100))
- issue_date (DATE)
- interest_rate (DECIMAL(5,2))
- tenure (INT) - in months
- emi_due (DECIMAL(10,2))
- total_loan_amount (DECIMAL(12,2))
- created_at, updated_at (TIMESTAMP)
```

### Payments Table
```sql
- id (INT, Primary Key)
- customer_id (INT, Foreign Key)
- account_number (VARCHAR(50))
- payment_date (DATETIME)
- payment_amount (DECIMAL(10,2))
- status (ENUM: 'completed', 'pending', 'failed')
- created_at (TIMESTAMP)
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- MySQL or MariaDB server
- npm or yarn

### Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Set up the database**

   ```bash
   mysql -u root -p < schema.sql
   ```

   Or manually run the SQL commands from `schema.sql` in your MySQL client.

3. **Configure environment variables**

   Create a `.env` file in the root directory:

   ```env
   PORT=3000
   DB_HOST=127.0.0.1
   DB_USER=root
   DB_PASSWORD=your_password
   DB_NAME=payment_collection
   ```

4. **Start the server**

   For development:
   ```bash
   npm run dev
   ```

   For production:
   ```bash
   npm start
   ```

The server will start on `http://localhost:3000` (or the port specified in `.env`).

## 📡 API Endpoints

### 1. Health Check
```http
GET /health
```

**Response:**
```json
{
  "status": "OK",
  "timestamp": "2025-12-17T10:30:00.000Z"
}
```

### 2. Get All Customers
```http
GET /customers
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "account_number": "ACC001",
      "customer_name": "Alen",
      "issue_date": "2023-01-15",
      "interest_rate": 8.50,
      "tenure": 24,
      "emi_due": 5000.00,
      "total_loan_amount": 100000.00
    }
  ]
}
```

### 3. Get Customer by Account Number
```http
GET /customers/:account_number
```

**Response:**
```json
{
  "success": true,
  "data": {
    "account_number": "ACC001",
    "customer_name": "Alen",
    "issue_date": "2023-01-15",
    "interest_rate": 8.50,
    "tenure": 24,
    "emi_due": 5000.00,
    "total_loan_amount": 100000.00
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Customer not found"
}
```

### 4. Submit Payment
```http
POST /payments
Content-Type: application/json
```

**Request Body:**
```json
{
  "account_number": "ACC001",
  "payment_amount": 5000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payment processed successfully",
  "data": {
    "payment_id": 6,
    "account_number": "ACC001",
    "payment_amount": 5000,
    "remaining_due": 0
  }
}
```

**Validation Errors:**
```json
{
  "success": false,
  "message": "Account number and payment amount are required"
}
```

```json
{
  "success": false,
  "message": "Payment amount must be greater than zero"
}
```

### 5. Get Payment History
```http
GET /payments/:account_number
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "payment_date": "2024-01-15T00:00:00.000Z",
      "payment_amount": 5000.00,
      "status": "completed",
      "customer_name": "Alen"
    }
  ]
}
```

## 🔒 Key Features Implementation

### Connection Pool Management
- Uses `mysql2/promise` with connection pooling
- Maximum 10 concurrent connections
- Automatic connection release after use
- Safe error handling prevents connection leaks

### Transaction Safety
The `/payments` endpoint uses database transactions:
1. Begin transaction
2. Verify customer exists
3. Insert payment record
4. Update EMI due amount
5. Commit transaction (or rollback on error)

### Error Handling
- All routes wrapped in try-catch blocks
- Database connection errors handled gracefully
- Always sends response (prevents frontend hanging)
- Proper HTTP status codes (400, 404, 500)

## 🐛 Troubleshooting

### Issue: Cannot connect to database
**Solution**: Check your `.env` file credentials and ensure MySQL server is running:
```bash
sudo systemctl status mysql
# or
sudo systemctl start mysql
```

### Issue: Port already in use
**Solution**: Change the PORT in `.env` or kill the process using port 3000:
```bash
lsof -ti:3000 | xargs kill -9
```

### Issue: Foreign key constraint fails
**Solution**: Ensure customer exists before inserting payment. The API handles this automatically.

## 🔧 Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon (auto-reload)

## 📦 Dependencies

### Production
- `express` (v5.2.1) - Web framework
- `mysql2` (v3.16.0) - MySQL client with promise support
- `cors` (v2.8.5) - Enable CORS
- `dotenv` (v17.2.3) - Environment variable management

### Development
- `nodemon` (v3.1.11) - Auto-restart on file changes

## 🔐 Security Considerations

- Use parameterized queries to prevent SQL injection
- Environment variables for sensitive data
- CORS configured (adjust for production)
- Input validation on all endpoints
- Transaction rollback on errors

## 🚀 Production Deployment

1. Set `NODE_ENV=production` in environment
2. Use a process manager like PM2:
   ```bash
   npm install -g pm2
   pm2 start server.js --name payment-api
   pm2 save
   pm2 startup
   ```
3. Configure nginx as reverse proxy
4. Set up SSL certificate
5. Use production-ready database credentials

## 📊 Sample Data

The `schema.sql` includes 5 sample customers and payment history for testing:
- ACC001 - Alen (₹100,000 loan)
- ACC002 - Sachin (₹120,000 loan)
- ACC003 - Sharma (₹150,000 loan)
- ACC004 - Aswin (₹200,000 loan)
- ACC005 - Steve (₹80,000 loan)

## 📄 License

This project is for educational/evaluation purposes.

## 👤 Author

Shanavas

---

**Note**: Ensure database is set up and running before starting the server.
