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
      try {
        //1.join the room
        nsSocket.join(roomToJoin);
        // //2 find number of clients in the room
        // const listOfClients = await io
        //   .of(ns.endpoint)
        //   .in(roomToJoin)
        //   .allSockets();
        // newNumberOfMembersCallback(listOfClients.size);
        //3 show history
        //find the room
        const thisRoom = findRoom(ns, roomToJoin);
        //send this room back to the client
        nsSocket.emit("historyCatchUp", thisRoom.history);
        //send back the number of users in this room

        await updateUsersInTheRoom(ns, roomToJoin);
      } catch (error) {
        console.error(err.message);
      }
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

      //find the room object for this room
      const roomObject = findRoom(ns, roomTitle);
      roomObject.addMessage(fullMsg);
      // console.log(roomObject);
      //send
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
