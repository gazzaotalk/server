const express = require('express');
const { query } = require('express-validator');
const User = require('../models/User');
const Room = require('../models/Room');
const Message = require('../models/Message');
const RoomUser = require('../models/RoomUser');
const loginRequired = require('../middlewares/loginRequired');

const api = express.Router();

api.get('/profile', loginRequired, (req, res) => {
  res.json(req.user);
});

api.put('/profile', loginRequired, async (req, res) => {
  const { birthday, bio } = req.body;

  const updatedUser = await User.findByIdAndUpdate(req.user._id, {
    birthday,
    bio,
  })
    .lean()
    .exec();
  res.json(updatedUser);
});

api.get('/users', loginRequired, query('name').not().isEmpty(), async (req, res) => {
  const { name } = req.query;
  if (!name) {
    return res.status(400).json({ message: '검색할 ID를 입력해주세요' });
  }
  const user = await User.findOne({ name }).select('-friends').lean().exec();

  if (user === null) {
    return res.status(404).json({ message: `${name} 사용자를 찾을 수 없습니다` });
  }
  return res.json(user);
});

api.get('/rooms', loginRequired, async (req, res) => {
  const rooms = (await RoomUser.find({ user: req.user._id }).populate('room').lean().exec()).flatMap(
    ({ room, last_seen }) => ({ ...room, last_seen }),
  );
  res.json(rooms);
});

api.get('/rooms/:roomId', loginRequired, async (req, res) => {
  const { roomId } = req.params;

  const room = await Room.findOne({ _id: roomId }).lean().exec();
  const users = (await RoomUser.find({ room: roomId }).populate('user').select('-room').lean().exec()).map(
    ({ user, last_seen }) => ({ ...user, last_seen }),
  );

  res.json({ ...room, users });
});

api.post('/rooms', loginRequired, async (req, res) => {
  const { name, users: userIds } = req.body;

  const createdRoom = await Room.create({ name }).lean().exec();
  const users = RoomUser.insertMany(
    userIds.map((userId) => ({
      room: createdRoom._id,
      user: userId,
    })),
  )
    .lean()
    .exec();

  res.status(201).json({ ...createdRoom, users });
});

api.get('/rooms/:roomId/messages', loginRequired, async (req, res) => {
  const { roomId } = req.params;
  const { offset } = req.query;

  const messages = await Message.find({
    room: roomId,
    ...(offset ? { _id: { $lt: offset } } : {}),
  })
    .sort({ _id: -1 })
    .limit(100)
    .lean()
    .exec();

  res.json(messages);
});

api.get('/friends', loginRequired, async (req, res) => {
  const user = await User.find({ _id: req.user._id }).populate('friends').select('friends').lean().exec();
  const friends = user.friends ?? [];

  res.json(friends);
});

api.put('/friends', loginRequired, async (req, res) => {
  const { _id } = req.body;

  await User.updateOne({ _id: req.user._id }, { $push: { friends: _id } });
  res.sendStatus(200);
});

module.exports = api;
