import express from "express";
import * as path from "path";
import { Server } from "socket.io";
const app = express();
const __dirname = path.resolve(path.dirname(""));

app.use(express.static(path.join(__dirname, "/public")));

const expressServer = app.listen(8000, () => {
  console.log("server listen on port 8000");
});

const io = new Server(expressServer, {
  cors: {
    origin: "*",
  },
});

//'connect' is the same as 'connection'
//create socket io server (io) / namespace
io.on("connection", (socket) => {
  console.log("Connect to main namespace");

  //receive event
  //when receive message from client emit message to all clients
  socket.on("userMessageToServer", (message) => {
    //need to use Server(io) NOT single socket
    io.emit("userMessageToClient", message);
  });
  //the Server can communicate across namespace but the Client need to be in THAT namespace in order to get the event
  //ROOMS
  //join room level1
  socket.join("level1");
  //send message to the room, comes to everybody exept who send it
  socket.to("level1").emit("joined", `${socket.id} joins to level 1 room`);
  //send message to the namespace, comes to everybody
  io.of("/")
    .to("level1")
    .emit("joined", `${socket.id} joins to level 1 room from namespace`);
});

//create admin namespace
io.of("/admin").on("connection", () => {
  console.log("Connect to admin namespace");
  io.of("/admin").emit("welcome", { data: "Welcome to admin chanel" });
});
