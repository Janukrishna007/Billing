const router = require('express').Router();
const Inventory = require('../models/inventory.model');

router.get('/', async (req, res) => {
  try {
    const inventory = await Inventory.find();
    res.json(inventory);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.post('/update', async (req, res) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(
      req.body.id,
      { $set: req.body },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router; 