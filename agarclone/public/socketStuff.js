let socket = io.connect("http://localhost:8000");
const htmlLeaderBoard = document.querySelector(".leader-board");
const gameMessage = document.getElementById("game-message");
//this function is called when user hit start button
function init() {
  draw();
  //player click start button from uiStuff
  socket.emit("init", {
    playerName: player.name,
  });
}
//get event for creating the field
socket.on("initReturn", (data) => {
  orbs = data.orbs;
  setInterval(() => {
    //if only xVector is defined
    if (player.xVector) {
      socket.emit("tick", {
        xVector: player.xVector,
        yVector: player.yVector,
      });
    }
  }, 33);
});
//get where all players are
socket.on("tock", (data) => {
  // console.log("tock client: ", data);
  //update players
  players = data.players;
});

socket.on("orbSwitch", (data) => {
  // console.log(data);
  orbs.splice(data.orbIndex, 1, data.newOrb);
});
//get socket player where it is
socket.on("tickTock", (data) => {
  player.locX = data.playerX;
  player.locY = data.playerY;
});
//get data from server to update leader board
socket.on("updateLeaderBoard", (data) => {
  // console.log(`data`, data)
  htmlLeaderBoard.innerHTML = "";
  data.forEach((curPlayer) => {
    htmlLeaderBoard.innerHTML += `<li class="leaderboard-player">${curPlayer.name}-${curPlayer.score}</li>`;
  });
});

socket.on("playerDeath", (data) => {
  console.log(`data`, data);
  gameMessage.innerHTML = "";
  gameMessage.innerHTML = `${data.died.name} was killed by ${data.killedBy.name}`;
  gameMessage.style.backgroundColor = "#00e6e6";
  gameMessage.style.opacity = 1;
  gameMessage.style.display = "block";
  $("#game-message").fadeOut(5000);
});
