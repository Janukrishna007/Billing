const router = require('express').Router();
const Bill = require('../models/bill.model');
const Transaction = require('../models/transaction.model');

router.get('/dashboard', async (req, res) => {
  try {
    const totalBills = await Bill.countDocuments();
    const paidBills = await Bill.countDocuments({ status: 'paid' });
    const overdueBills = await Bill.countDocuments({ status: 'overdue' });
    const totalAmount = await Bill.aggregate([
      { $group: { _id: null, total: { $sum: "$amount" } } }
    ]);

    res.json({
      totalBills,
      paidBills,
      overdueBills,
      totalAmount: totalAmount[0]?.total || 0
    });
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router; 