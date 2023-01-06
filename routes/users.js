const express = require('express');
const { query } = require('express-validator');
const User = require('../models/User');
const loginRequired = require('../middlewares/login-required');

const router = express.Router();

router.get('/', loginRequired, query('name').not().isEmpty(), async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: '검색할 ID를 입력해주세요' });
  }

  const user = await User.findOne({ name }).select('-friends').lean().exec();

  if (user === null) {
    return res.status(404).json({ message: `${name} 사용자를 찾을 수 없습니다` });
  }
  res.json(user);
});

module.exports = router;
