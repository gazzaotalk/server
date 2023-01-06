const mongoose = require("mongoose");

const RoomUserSchema = new mongoose.Schema({
  room: {
    type: mongoose.Types.ObjectId,
    ref: "Room",
    required: true,
    index: true,
  },
  user: {
    type: mongoose.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  last_seen: {
    type: Date,
    required: true,
    default: () => new Date(),
  },
});

RoomUserSchema.index({ room: 1, user: 1 }, { unique: true });

const RoomUser = mongoose.model("RoomUser", RoomUserSchema);

module.exports = RoomUser;
