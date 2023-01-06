const dotenv = require('dotenv');

dotenv.config();

const { MONGODB_URI, SECRET_KEY, NODE_ENV } = process.env;

const settings = {
  MONGODB_URI,
  SECRET_KEY,
  IS_DEV: NODE_ENV === 'development',
};

module.exports = settings;
