const { Server, Socket } = require('socket.io');
const cookie = require('cookie');
const JwtService = require('./jwt-service');
const RoomUser = require('../models/RoomUser');
const Message = require('../models/Message');
const settings = require('../settings');
const Room = require('../models/Room');

const ChatService = {
  /** @type {Server} */
  io: null,

  /** @type {Record<string, Socket>} */
  sockets: {},

  init(io) {
    this.io = io;

    this.io.on('connection', async (socket) => {
      const userId = socket.user._id;
      console.log(`${socket.user.name} (${userId}) connected`);

      // connect ~ disconnect
      this.sockets[userId] = socket;
      socket.on('disconnect', () => {
        delete this.sockets[userId];
        console.log(`${socket.user.name} (${userId}) disconnected`);
      });

      (await RoomUser.find({ user: userId }).lean().exec()).forEach(({ room: roomId }) => this.join(userId, roomId));

      socket.on('message', (datagram) => {
        const { room: roomId, content } = datagram;

        if (!content) {
          return;
        }

        console.log(datagram);

        if (settings.IS_DEV) {
          Room.findOne({ _id: roomId })
            .lean()
            .exec()
            .then((room) => {
              console.log(`[${room.name}] ${socket.user.name}: ${content}`);
            });
        }

        const message = {
          room: roomId,
          user: socket.user._id,
          content,
          date: new Date(),
        };
        this.io.in(roomId).emit('message', message);
        Message.create(message);
      });
    });

    this.io.use(async (socket, next) => {
      const cookies = cookie.parse(socket.handshake.headers?.cookie);
      const rawToken = cookies.token;

      if (!rawToken) {
        return next(new Error('로그인되어있지 않습니다'));
      }
      const token = await JwtService.verify(rawToken);
      const user = await JwtService.getUser(token);

      if (!user) {
        console.log('WARN: Unauthorized socket detected');
        return next(new Error('잘못된 토큰입니다'));
      }
      socket.user = user;
      next();
    });
  },

  join(userId, roomId) {
    const socket = this.sockets[String(userId)];
    socket.join(String(roomId));
  },

  leave(userId, roomId) {
    const socket = this.sockets[String(userId)];
    socket.leave(String(roomId));
  },
};

module.exports = ChatService;
