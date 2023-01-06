const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
  room: {
    type: mongoose.Types.ObjectId,
    ref: 'Room',
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date(),
    index: true,
  },
  content: {
    type: String,
    required: true,
  },
});

const Message = mongoose.model('Message', MessageSchema);

module.exports = Message;
