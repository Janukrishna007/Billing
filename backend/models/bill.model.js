const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  customerId: { type: String, required: true },
  dueDate: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'paid', 'overdue'], default: 'pending' },
  category: { type: String, required: true },
  environmentalImpact: {
    carbonFootprint: Number,
    energyEfficiency: String
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Bill', billSchema); 