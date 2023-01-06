const { expressjwt } = require('express-jwt');
const settings = require('../settings');
const JwtService = require('../services/jwt-service');

const { SECRET_KEY } = settings;

const getToken = (req) => {
  if ((req.headers.authorization ?? '').split(' ').shift() === 'Bearer') {
    return req.headers.authorization.split(' ')[1];
  }
  if (req.cookies.token) {
    return req.cookies.token;
  }
  return null;
};

const isRevokedCallback = async (req, token) => {
  const user = await JwtService.getUser(token);
  req.user = user;

  return false;
};

const jwt = expressjwt({
  secret: SECRET_KEY,
  algorithms: ['HS256'],
  credentialsRequired: false,
  isRevoked: isRevokedCallback,
  getToken: getToken,
});

module.exports = jwt;
