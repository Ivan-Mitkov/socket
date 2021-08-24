// Where all our main socket stuff will go
import { io } from "../server.js";
import { Orb } from "./classes/Orb.js";

let orbs = [];
initGame();
io.sockets.on("connect", (socket) => {
  socket.emit("init", { orbs });
});
//Run at the begging of a new game
function initGame() {
  for (let index = 0; index < 500; index++) {
    orbs.push(new Orb());
  }
}
export default io;
