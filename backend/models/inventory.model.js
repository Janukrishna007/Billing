const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  quantity: { type: Number, required: true },
  category: String,
  lastUpdated: { type: Date, default: Date.now },
  status: { type: String, enum: ['in-stock', 'low-stock', 'out-of-stock'] },
  reorderPoint: Number
});

module.exports = mongoose.model('Inventory', inventorySchema); 