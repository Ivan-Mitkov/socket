// Where all our main socket stuff will go
import { io } from "../server.js";
import { Player, PlayerConfig, PlayerData, Orb } from "./classes/index.js";
import {
  checkForOrbCollisions,
  checkForPlayerCollisions,
} from "./checkCollisions.js";
//coresponding variables in back and front end
let orbs = [];
let players = [];
//game settings
let settings = {
  defaultOrbs: 5000,
  defaultSpeed: 5,
  defaultRadius: 5,
  //as the player get bigger the zoom needs to go out
  defaultZoom: 1.5,
  worldWidth: 5000,
  worldHeight: 5000,
};
initGame();
setInterval(() => {
  //more efficient sending data
  //send to all players where players are
  if (players.length > 0) {
    //broadcast to the enrire namespace
    io.to("game").emit("tock", {
      players,
    });
  }
}, 33); //there are 30 33's in 1 second so to run with rate 30 fps 33

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
      // broadcast to just the client define the camera for a particular player
      socket.emit("tickTock", {
        playerX: player.playerData.locX,
        playerY: player.playerData.locY,
      });
    }, 33); //there are 30 33's in 1 second so to run with rate 30 fps 33

    //after creating player emit event for orbs
    socket.emit("initReturn", { orbs });
    //what others need to know
    // console.log(playerData);
    players.push(playerData);
  });
  //get data for player movement
  socket.on("tick", (data) => {
    //if there are valid xVector and yVector
    if (data.xVector && data.yVector && player.playerConfig) {
      // console.log("tick", data);//tick { xVector: 0.45085653968277384, yVector: -0.5491434603172262 }
      // move player movement from client side to server side
      let speed = player.playerConfig.speed;
      //update playerConfig object
      let xV = (player.playerConfig.xVector = data.xVector);
      let yV = (player.playerConfig.yVector = data.yVector);
      //server decides where new coordinates are
      if (
        (player.playerData.locX < 5 && player.playerData.xVector < 0) ||
        (player.playerData.locX > settings.worldWidth && xV > 0)
      ) {
        player.playerData.locY -= speed * yV;
      } else if (
        (player.playerData.locY < 5 && yV > 0) ||
        (player.playerData.locY > settings.worldHeight && yV < 0)
      ) {
        player.playerData.locX += speed * xV;
      } else {
        player.playerData.locX += speed * xV;
        player.playerData.locY -= speed * yV;
      }
    }
    //check for orb collisions
    let capturedOrb = checkForOrbCollisions(
      player.playerData,
      player.playerConfig,
      orbs,
      settings
    );

    capturedOrb
      .then((data) => {
        // console.log("collision", data);
        const orbData = {
          orbIndex: data,
          newOrb: orbs[data],
        };
        // console.log(orbData);
        //emit to all sockets
        //update score
        io.sockets.emit("updateLeaderBoard", getLeaderBoard());
        //send new orbs
        io.sockets.emit("orbSwitch", orbData);
      })
      .catch(() => {
        // console.log("No collision");
      });

    //PLAYER collisions
    // console.log(players);
    let playerDeath = checkForPlayerCollisions(
      player.playerData,
      player.playerConfig,
      players,
      player.socketId
    );

    playerDeath
      .then((data) => {
        // console.log("Player collision");
        //emit to all sockets
        //update score
        io.sockets.emit("updateLeaderBoard", getLeaderBoard());
        io.sockets.emit("playerDeath", data);
        //{
        //   died: killed,
        //   killedBy: killer,
        // };
      })
      .catch(() => {});
  });
  socket.on("disconnect", (data) => {
    // console.log(data)//transport close
    //find who just left ...which player in players
    if (player && player.playerData) {
      //if player exists
      players.forEach((p, i) => {
        //remove player from the array
        if (p.uuid == player.playerData.uuid) {
          players.splice(i, 1);
          io.sockets.emit("updateLeaderBoard", getLeaderBoard());
        }
      });
      //if there is DB update DB
    }
  });
});
function getLeaderBoard() {
  //sort players in descending order
  players.sort((a, b) => {
    return b.score - a.score;
  });
  let leaderBoard = players.map((curPlayer) => {
    return {
      name: curPlayer.name,
      score: curPlayer.score,
    };
  });
  return leaderBoard;
}
//Run at the begging of a new game
function initGame() {
  for (let index = 0; index < settings.defaultOrbs; index++) {
    orbs.push(new Orb(settings));
  }
}
export default io;
