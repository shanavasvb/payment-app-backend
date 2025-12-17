const express = require('express');
const cors = require('cors');
const http = require('http');
const mysql = require('mysql2/promise');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});


// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || '127.0.0.1',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'payment_collection',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

//  Retrieve all customer loan details
app.get('/customers', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await pool.query('SELECT COUNT(*) as total FROM customers');
    const total = countResult[0].total;

    // Get paginated data
    const [rows] = await pool.query(`
      SELECT 
        account_number,
        issue_date,
        interest_rate,
        tenure,
        emi_due,
        customer_name,
        total_loan_amount
      FROM customers
      ORDER BY account_number
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const totalPages = Math.ceil(total / limit);
    const hasMore = page < totalPages;

    res.json({ 
      success: true, 
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasMore
      }
    });
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customer data' });
  }
});

//  Get specific customer details
app.get('/customers/:account_number', async (req, res) => {
  try {
    const { account_number } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM customers WHERE account_number = ?',
      [account_number]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }
    
    res.json({ success: true, data: rows[0] });
  } catch (error) {
    console.error('Error fetching customer:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch customer data' });
  }
});

// POST /payments - Make a payment
app.post('/payments', async (req, res) => {
  let connection;
  
  try {
    const { account_number, payment_amount } = req.body;
    
    // Validation
    if (!account_number || !payment_amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Account number and payment amount are required' 
      });
    }
    
    if (payment_amount <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment amount must be greater than zero' 
      });
    }
    
    connection = await pool.getConnection();
    await connection.beginTransaction();
    
    // Check if customer exists
    const [customers] = await connection.query(
      'SELECT id, emi_due FROM customers WHERE account_number = ?',
      [account_number]
    );
    
    if (customers.length === 0) {
      await connection.rollback();
      return res.status(404).json({ 
        success: false, 
        message: 'Customer account not found' 
      });
    }
    
    const customer = customers[0];
    
    // Insert payment record
    const [result] = await connection.query(
      `INSERT INTO payments (customer_id, account_number, payment_date, payment_amount, status) 
       VALUES (?, ?, NOW(), ?, 'completed')`,
      [customer.id, account_number, payment_amount]
    );
    
    // Update EMI due 
    const newEmiDue = Math.max(0, customer.emi_due - payment_amount);
    await connection.query(
      'UPDATE customers SET emi_due = ? WHERE id = ?',
      [newEmiDue, customer.id]
    );
    
    await connection.commit();
    
    res.json({ 
      success: true, 
      message: 'Payment processed successfully',
      data: {
        payment_id: result.insertId,
        account_number,
        payment_amount,
        remaining_due: newEmiDue
      }
    });
    
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    console.error('Error processing payment:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to process payment' 
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});

// Get all payment history (for all customers) with pagination
app.get('/payments', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const [countResult] = await pool.query(
      'SELECT COUNT(*) as total FROM payments'
    );
    const total = countResult[0].total;

    // Get paginated results
    const [rows] = await pool.query(
      `SELECT 
        p.id,
        p.payment_date,
        p.payment_amount,
        p.status,
        p.account_number,
        c.customer_name
      FROM payments p
      JOIN customers c ON p.customer_id = c.id
      ORDER BY p.payment_date DESC
      LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    
    res.json({ 
      success: true, 
      data: rows,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasMore: offset + rows.length < total
      }
    });
  } catch (error) {
    console.error('Error fetching all payments:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch payment history' 
    });
  }
});

// Get payment history
app.get('/payments/:account_number', async (req, res) => {
  try {
    const { account_number } = req.params;
    
    const [rows] = await pool.query(
      `SELECT 
        p.id,
        p.payment_date,
        p.payment_amount,
        p.status,
        c.customer_name
      FROM payments p
      JOIN customers c ON p.customer_id = c.id
      WHERE p.account_number = ?
      ORDER BY p.payment_date DESC`,
      [account_number]
    );
    
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch payment history' 
    });
  }
});

// Health check 
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong!' });
});
const server = http.createServer(app);

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on port ${PORT}`);
});
