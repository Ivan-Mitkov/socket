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
//create socket io server (io)
io.on("connection", (socket) => {
  //receive event
  //when receive message from client emit message to all clients
  socket.on("userMessageToServer", (message) => {
    //need to use Server(io) NOT single socket
    io.emit("userMessageToClient", message);
  });
});
