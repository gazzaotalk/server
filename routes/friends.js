const express = require('express');
const User = require('../models/User');
const loginRequired = require('../middlewares/login-required');

const router = express.Router();

router.get('/', loginRequired, async (req, res) => {
  const user = await User.find({ _id: req.user._id }).populate('friends').select('friends').lean().exec();
  const friends = user.friends ?? [];

  res.json(friends);
});

router.put('/', loginRequired, async (req, res) => {
  const { _id } = req.body;

  await User.updateOne({ _id: req.user._id }, { $push: { friends: _id } });
  res.sendStatus(200);
});

module.exports = router;
