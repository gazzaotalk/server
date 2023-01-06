const express = require('express');
const User = require('../models/User');
const JwtService = require('../services/jwt-service');
const settings = require('../settings');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { username, password, birthday } = req.body;

  const createdUser = await User.create({ username, password, birthday }).lean().exec();
  const rawToken = JwtService.sign(createdUser);

  res
    .cookie('token', rawToken, { httpOnly: true, secure: settings.IS_DEV ? false : true })
    .status(201)
    .json(createdUser);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ name: username, password }).exec();
  if (!user) {
    return res.status(400).json({ message: '아이디 또는 패스워드가 일치하지 않습니다.' });
  }
  const rawToken = JwtService.sign(user);

  res.cookie('token', rawToken, { httpOnly: true, secure: settings.IS_DEV ? false : true }).json(user);
});

module.exports = router;
