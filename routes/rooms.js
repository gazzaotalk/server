const express = require('express');
const loginRequired = require('../middlewares/login-required');
const Message = require('../models/Message');
const Room = require('../models/Room');
const RoomUser = require('../models/RoomUser');

const router = express.Router();

router.get('/', loginRequired, async (req, res) => {
  const rooms = (await RoomUser.find({ user: req.user._id }).populate('room').lean().exec()).flatMap(
    ({ room, last_seen }) => ({ ...room, last_seen }),
  );
  res.json(rooms);
});

router.get('/:roomId', loginRequired, async (req, res) => {
  const { roomId } = req.params;

  const room = await Room.findOne({ _id: roomId }).lean().exec();
  const users = (await RoomUser.find({ room: roomId }).populate('user').select('-room').lean().exec()).map(
    ({ user, last_seen }) => ({ ...user, last_seen }),
  );

  res.json({ ...room, users });
});

router.post('/', loginRequired, async (req, res) => {
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

router.get('/:roomId/messages', loginRequired, async (req, res) => {
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

module.exports = router;
