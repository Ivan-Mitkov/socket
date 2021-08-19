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
  io.of(ns.endpoint).on("connection", (nsSocket) => {
    console.log(`${nsSocket.id} has join ${ns.endpoint}`);
    //connect to some namespace
    //send that ns back
    nsSocket.emit("nsRoomLoad", namespaces[0].rooms);
    //handle joining room from the client
    nsSocket.on("joinRoom", async (roomToJoin, newNumberOfMembersCallback) => {
      //@TODO deal with history
      //join the room
      nsSocket.join(roomToJoin);
      //find number of clients in the room

      const listOfClients = await io.of("/wiki").in(roomToJoin).allSockets();
      // console.log(listOfClients);
      newNumberOfMembersCallback(listOfClients.size);
    });
    //get message from message form
    nsSocket.on("newMessageToServer", (msg) => {
      //create full message
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        username: "Ivan",
        avatar:
          "https://images.pexels.com/photos/7543203/pexels-photo-7543203.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=15&w=15",
      };
      //Send this message to all the sockets in the room
      //find the room
      const roomTitle = [...nsSocket.rooms.keys()][1];
      // console.log('found room: ',arrOfRooms);
      //send
      io.of(ns.endpoint).to(roomTitle).emit("messageToClient", fullMsg);
    });
  });
});
