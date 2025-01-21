const mongoose = require('mongoose');

const iotSchema = new mongoose.Schema({
  deviceId: { type: String, required: true },
  readingType: { type: String, required: true },
  value: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  location: String
});

module.exports = mongoose.model('IoT', iotSchema); 