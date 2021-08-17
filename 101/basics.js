import http from "http";
import { Server } from "socket.io";

const server = http.createServer((req, res) => {
  res.end("I'm connected");
});
//https://socket.io/docs/v4/server-initialization/

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});
io.on("connection", (socket, req) => {
  //custom events
  //https://socket.io/docs/v4/emitting-events/
  socket.emit("welcome", "Welcome to the land of sockets :) ");
  socket.on("message", (msg) => {
    console.log("MESSAGE FROM CLIENT: ", msg.toString());
    setTimeout(() => {
      socket.emit("message-response", msg.toString());
    }, 3000);
  });
});
server.listen(5500, () => {
  console.log(`Server listen on port 5500`);
});
