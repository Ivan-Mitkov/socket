import express from "express";
import * as path from "path";
import { Server } from "socket.io";
import namespaces from "./data/namespaces.js";
// console.log(`namespaces`, namespaces);

const app = express();
const __dirname = path.resolve(path.dirname(""));

app.use(express.static(path.join(__dirname, "/public")));
//create express server
const expressServer = app.listen(8000, () => {
  console.log("server listen on port 8000");
});
// create socket.io server and pass express server
const io = new Server(expressServer, {
  cors: {
    origin: "*",
  },
});

//Connect to the main namespace
io.on("connection", (socket) => {
  // console.log(socket.handshake);

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
namespaces.forEach((ns, i) => {
  io.of(ns.endpoint).on("connection", (nsSocket) => {
    //get query params from client
    const username = nsSocket.handshake.query.username;
    //connect to some namespace
    //send that ns back
    nsSocket.emit("nsRoomLoad", namespaces[i].rooms);

    //handle joining room from the client
    nsSocket.on("joinRoom", async (roomToJoin) => {
      //0.leave previous room
      //[Set Iterator] { 'N0Pd0o1_5mUVtSHlAAAM', 'Other' } we need 'Other' this is the old room before entering new one
      const roomTitle = [...nsSocket.rooms.keys()][1];
      nsSocket.leave(roomTitle);

      //1.join the room
      nsSocket.join(roomToJoin);
      //find the room
      const thisRoom = findRoom(ns, roomToJoin);
      //send this room with history back to the client
      nsSocket.emit("historyCatchUp", thisRoom.history);
      //send back to the client the number of users in this room
      try {
        await updateUsersInTheRoom(ns, roomToJoin);
      } catch (error) {
        console.error(error.message);
      }
    });
    //get message from message form
    nsSocket.on("newMessageToServer", (msg) => {
      //create full message
      const fullMsg = {
        text: msg.text,
        time: Date.now(),
        //get username from query send by the client
        username: username,
        avatar:
          "https://images.pexels.com/photos/7543203/pexels-photo-7543203.jpeg?auto=compress&cs=tinysrgb&dpr=3&h=15&w=15",
      };
      //Send this message to all the sockets in the room
      //find the room
      const roomTitle = [...nsSocket.rooms.keys()][1];
      //find the room object for this room
      const roomObject = findRoom(ns, roomTitle);
      //add message to history
      roomObject.addMessage(fullMsg);
      // console.log(roomObject);
      //send message to the client
      io.of(ns.endpoint).to(roomTitle).emit("messageToClient", fullMsg);
    });
  });
});

function findRoom(ns, roomTitle) {
  return ns.rooms.find(
    (room) => room.roomTitle === roomTitle && room.namespace === ns.nsTitle
  );
}

async function updateUsersInTheRoom(namespace, room) {
  let socketRoom = await io.of(namespace.endpoint).in(room).allSockets();
  io.of(namespace.endpoint).in(room).emit("updateMembers", socketRoom.size);
}
