const db = require('./db');
const Message = require('./models/Message');
const User = require('./models/User');
const Room = require('./models/Room');
const RoomUser = require('./models/RoomUser');

db.connect().then(async () => {
  const users = [
    ['solo5star', 'solo5star', '1999-01-01', 'Good!'],
    ['thdwoqor', 'thdwoqor', '1998-09-09', 'Not bad'],
    ['cat', 'cat', '2003-06-04', '야옹'],
    ['fox', 'fox', '2002-03-07', '왈왈'],
    ['dog', 'dog', '2010-02-05', '멍멍'],
    ['frog', 'frog', '2008-11-23', '개굴'],
  ].map(([name, password, birthday, bio]) => {
    return new User({ name, password, birthday, bio });
  });
  await Promise.all(users.map((user) => user.save()));

  const rooms = ['프론트엔드', '백엔드', '알고리즘', '플러터', 'AWS', '안드로이드'].map((name) => {
    return new Room({ name });
  });
  await Promise.all(rooms.map((room) => room.save()));

  const roomUsers = [
    ['solo5star', '프론트엔드'],
    ['solo5star', '백엔드'],
    ['solo5star', '알고리즘'],
    ['solo5star', 'AWS'],
    ['thdwoqor', '백엔드'],
    ['thdwoqor', 'AWS'],
    ['cat', '플러터'],
    ['cat', '안드로이드'],
    ['cat', '프론트엔드'],
    ['dog', '프론트엔드'],
    ['dog', '백엔드'],
    ['dog', 'AWS'],
    ['frog', '안드로이드'],
    ['frog', '프론트엔드'],
    ['frog', '알고리즘'],
    ['frog', 'AWS'],
  ].map(([username, roomname]) => {
    return new RoomUser({
      user: users.find((user) => user.name === username)._id,
      room: rooms.find((room) => room.name === roomname)._id,
    });
  });
  await Promise.all(roomUsers.map((roomUser) => roomUser.save()));

  const messages = [
    ['solo5star', '프론트엔드', '안녕하세요'],
    ['solo5star', '프론트엔드', '반갑습니다!'],
    ['solo5star', '백엔드', '백엔드 반가워요'],
    ['solo5star', '프론트엔드', '프론트엔드 좋아합니다'],
    ['thdwoqor', '백엔드', '백엔드 여러분 반가워요'],
    ['thdwoqor', '백엔드', '저는 스프링 합니다'],
    ['cat', '프론트엔드', '전 리액트해요'],
    ['solo5star', '프론트엔드', '저두요!'],
  ].map(([username, roomname, content]) => {
    return new Message({
      user: users.find((user) => user.name === username)._id,
      room: rooms.find((room) => room.name === roomname)._id,
      content: content,
    });
  });

  for (const message of messages) {
    await message.save();
  }
});
