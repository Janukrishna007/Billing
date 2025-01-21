const router = require('express').Router();
const Transaction = require('../models/transaction.model');

router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('billId');
    res.json(transactions);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.post('/add', async (req, res) => {
  const newTransaction = new Transaction(req.body);
  try {
    const savedTransaction = await newTransaction.save();
    res.json(savedTransaction);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router; 