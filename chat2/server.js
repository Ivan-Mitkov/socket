const path = require("path");
const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

//set static folder
app.use(express.static(path.join(__dirname, "public")));

const BOT_NAME = "ChatCord Bot";
io.on("connect", (socket) => {
  // console.log(`new socket connection`, socket.id);
  socket.emit("message", formatMessage(BOT_NAME, "Welcome to the Chat"));
  //broadcast when a user connects .broadcast emit to everybody EXEPT user that connects
  socket.broadcast.emit(
    "message",
    formatMessage(BOT_NAME, `User *** has joined the chat`)
  );
  //runs when client disconnects
  socket.on("disconnect", () => {
    io.emit("message", formatMessage(BOT_NAME, `User *** has left the chat`));
  });
  //get message text from form
  socket.on("chatMessage", (msg) => {
    io.emit("message", formatMessage("USER", msg));
  });
});
const PORT = 8000 || process.env.PORT;

server.listen(PORT, () => {
  `server started on port ${PORT}`;
});
