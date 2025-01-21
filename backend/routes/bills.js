const router = require('express').Router();
const Bill = require('../models/bill.model');

router.get('/', async (req, res) => {
  try {
    const bills = await Bill.find();
    res.json(bills);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.post('/add', async (req, res) => {
  const newBill = new Bill(req.body);
  try {
    const savedBill = await newBill.save();
    res.json(savedBill);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router; 