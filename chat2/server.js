const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

const BOT_NAME = "ChatCord Bot";
io.on("connect", (socket) => {
  //get username and room
  //join a room
  socket.on("joinRoom", ({ username, room }) => {
    const user = userJoin(socket.id, username, room);
    //join to the room
    socket.join(user.room);
    // console.log(`new socket connection`, socket.id);
    socket.emit("message", formatMessage(BOT_NAME, "Welcome to the Chat"));
    //broadcast when a user connects .broadcast emit to everybody EXEPT user that connects
    socket.broadcast
      .to(user.room)
      .emit(
        "message",
        formatMessage(
          BOT_NAME,
          `${user.username} has joined the ${user.room} chat`
        )
      );
    //send users and room info
    io.to(user.room).emit("roomUsers", {
      room: user.room,
      users: getRoomUsers(user.room),
    });
  });

  //get message text from form
  socket.on("chatMessage", (msg) => {
    const user = getCurrentUser(socket.id);
    io.to(user.room).emit("message", formatMessage(user.username, msg));
  });
  //runs when client disconnects
  socket.on("disconnect", () => {
    const user = userLeave(socket.id);
    if (user) {
      io.to(user.room).emit(
        "message",
        formatMessage(
          BOT_NAME,
          `${user.username} has left the ${user.room} chat`
        )
      );
      //send users and room info
      io.to(user.room).emit("roomUsers", {
        room: user.room,
        users: getRoomUsers(user.room),
      });
    }
  });
});
const PORT = 8000 || process.env.PORT;

server.listen(PORT, () => {
  `server started on port ${PORT}`;
});
