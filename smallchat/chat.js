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
io.on("connection", (socket) => {
  socket.emit("messageFromServer", {
    data: "Welcome to the socket.io server",
  });
  socket.on("messageToServer", (dataFromClient) => {
    console.log(dataFromClient);
  });
});
// console.log(io);
