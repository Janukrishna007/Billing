const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  billId: { type: mongoose.Schema.Types.ObjectId, ref: 'Bill' },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['payment', 'refund', 'adjustment'] },
  status: { type: String, enum: ['pending', 'completed', 'failed'] },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Transaction', transactionSchema); 