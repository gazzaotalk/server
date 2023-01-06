const express = require('express');
const profile = require('./profile');
const users = require('./users');
const friends = require('./friends');
const rooms = require('./rooms');
const diagnostics = require('./diagnostics');
const auth = require('./auth');

const routes = express.Router();

routes.use('/auth', auth);
routes.use('/profile', profile);
routes.use('/users', users);
routes.use('/friends', friends);
routes.use('/rooms', rooms);
routes.use('/', diagnostics);

module.exports = routes;
