const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  birthday: {
    type: Date,
    default: null,
  },
  bio: {
    type: String,
    default: null,
  },
  friends: [
    {
      type: mongoose.Types.ObjectId,
      ref: 'User',
    },
  ],
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
