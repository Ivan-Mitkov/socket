// Where all our main socket stuff will go
import { io } from "../server.js";
import { Player, PlayerConfig, PlayerData, Orb } from "./classes/index.js";
//coresponding variables in back and front end
let orbs = [];
let players = [];
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
  let player = {};
  //add the player to the game namespace, if there is a chat it will be added to different namespace
  //get the event emited on start button and create field
  //data is name
  socket.on("init", (data) => {
    socket.join("game");

    //make a player config object
    let playerConfig = new PlayerConfig(settings);
    let playerData = new PlayerData(data.playerName, settings);
    //master player object to hold both
    player = new Player(socket.id, playerConfig, playerData);
    //Issue a message to every connected socket every 30 fps
    setInterval(() => {
      io.to("game").emit("tock", {
        players,
        playerX: player.playerData.locX,
        playerY: player.playerData.locY,
      });
    }, 33); //there are 30 33's in 1 second so to run with rate 30 fps 33

    //after creating player emit event for orbs
    socket.emit("initReturn", { orbs });
    //
    players.push(playerData);
  });
  //get data for player movement
  socket.on("tick", (data) => {
    // console.log("tick", data);//tick { xVector: 0.45085653968277384, yVector: -0.5491434603172262 }
    // move player movement from client side to server side
    let speed = player.playerConfig.speed;
    //update playerConfig object
    let xV = (player.playerConfig.xVector = data.xVector);
    let yV = (player.playerConfig.yVector = data.yVector);

    if (
      (player.playerData.locX < 5 && player.playerData.xVector < 0) ||
      (player.playerData.locX > 500 && xV > 0)
    ) {
      player.playerData.locY -= speed * yV;
    } else if (
      (player.playerData.locY < 5 && yV > 0) ||
      (player.playerData.locY > 500 && yV < 0)
    ) {
      player.playerData.locX += speed * xV;
    } else {
      player.playerData.locX += speed * xV;
      player.playerData.locY -= speed * yV;
    }
  });
});
//Run at the begging of a new game
function initGame() {
  for (let index = 0; index < settings.defaultOrbs; index++) {
    orbs.push(new Orb(settings));
  }
}
export default io;
