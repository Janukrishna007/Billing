const router = require('express').Router();
const IoT = require('../models/iot.model');

router.post('/reading', async (req, res) => {
  const newReading = new IoT(req.body);
  try {
    const saved = await newReading.save();
    res.json(saved);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router; 