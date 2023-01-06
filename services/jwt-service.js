const jwt = require('jsonwebtoken');
const settings = require('../settings');
const User = require('../models/User');

const { SECRET_KEY } = settings;

const JwtService = {
  async verify(rawToken) {
    const payload = jwt.verify(rawToken, SECRET_KEY);
    return { payload } ?? null;
  },

  async getUser(token) {
    const id = token.payload.sub || token.payload.id;
    const user = await User.findOne({ _id: id }).lean().exec();

    return user;
  },

  sign(user) {
    return jwt.sign({ sub: user._id }, SECRET_KEY, { expiresIn: '14d' });
  },
};

module.exports = JwtService;
