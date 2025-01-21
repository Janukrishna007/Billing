const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema({
  customerId: { type: String, required: true },
  points: { type: Number, default: 0 },
  tier: { type: String, enum: ['bronze', 'silver', 'gold', 'platinum'] },
  history: [{
    action: String,
    points: Number,
    date: { type: Date, default: Date.now }
  }]
});

module.exports = mongoose.model('Reward', rewardSchema); 