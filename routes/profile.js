const express = require('express');
const loginRequired = require('../middlewares/login-required');
const User = require('../models/User');

const router = express.Router();

router.get('/', loginRequired, (req, res) => {
  res.json(req.user);
});

router.put('/', loginRequired, async (req, res) => {
  const { birthday, bio } = req.body;

  const updatedUser = await User.findByIdAndUpdate(req.user._id, {
    birthday,
    bio,
  })
    .lean()
    .exec();
  res.json(updatedUser);
});

module.exports = router;
