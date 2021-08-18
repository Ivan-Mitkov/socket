import express from "express";
import * as path from "path";
import { Server } from "socket.io";
import namespaces from "./data/namespaces.js";
// console.log(`namespaces`, namespaces);

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

//Connect to the main namespace
io.on("connection", (socket) => {
  //build an array to send back with the img and endpoint for each NS
  let nsData = namespaces.map((ns) => {
    return {
      img: ns.img,
      endpoint: ns.endpoint,
    };
  });
  //send nsData back to the client, we use socket not io because we want to go to just this client
  socket.emit("nsList", nsData);
});
// loop through namespaces
namespaces.forEach((ns) => {
  io.of(ns.endpoint).on("connection", (socket) => {
    console.log(`${socket.id} has join ${ns.endpoint}`);
  });
});
