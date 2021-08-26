// Where all our main socket stuff will go
import { io } from "../server.js";
import { Player, PlayerConfig, PlayerData, Orb } from "./classes/index.js";

let orbs = [];
//game settings
let settings = {
  defaultOrbs: 500,
  defaultSpeed: 3,
  defaultRadius: 6,
  //as the player get bigger the zoom needs to go out
  defaultZoom: 1.5,
  worldWidth: 500,
  worldHeight: 500,
};
initGame();
io.sockets.on("connect", (socket) => {
  //get the event emited on start button and create field
  socket.on("init", (data) => {
    //make a player config object
    let playerConfig = new PlayerConfig(settings);
    let playerData = new PlayerData(data.playerName, settings);
    //master player object to hold both
    let player = new Player(socket.id, playerConfig, playerData);
    //after creating player emit event for orbs
    socket.emit("initReturn", { orbs });
    //
    players.push(playerData);
  });
});
//Run at the begging of a new game
function initGame() {
  for (let index = 0; index < settings.defaultOrbs; index++) {
    orbs.push(new Orb(settings));
  }
}
export default io;
