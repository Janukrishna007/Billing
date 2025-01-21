const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// Basic CORS setup
app.use(cors());
app.use(express.json());

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Bills routes
app.get('/api/bills', (req, res) => {
  res.json([
    {
      _id: '1',
      customerId: 'CUST001',
      amount: 100,
      status: 'pending',
      dueDate: new Date()
    }
  ]);
});

// Inventory routes
app.get('/api/inventory', (req, res) => {
  res.json([
    {
      _id: '1',
      itemName: 'Test Item',
      quantity: 10,
      status: 'in-stock'
    }
  ]);
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Test the server at http://localhost:${port}`);
}); 