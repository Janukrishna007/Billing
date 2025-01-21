const router = require('express').Router();
const Reward = require('../models/reward.model');

router.get('/customer/:id', async (req, res) => {
  try {
    const rewards = await Reward.findOne({ customerId: req.params.id });
    res.json(rewards);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

router.post('/add-points', async (req, res) => {
  try {
    const reward = await Reward.findOneAndUpdate(
      { customerId: req.body.customerId },
      { 
        $inc: { points: req.body.points },
        $push: { 
          history: {
            action: req.body.action,
            points: req.body.points
          }
        }
      },
      { new: true, upsert: true }
    );
    res.json(reward);
  } catch (err) {
    res.status(400).json('Error: ' + err);
  }
});

module.exports = router; 