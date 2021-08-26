let socket = io.connect("http://localhost:8000");

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
  // console.log(data)
  //orbs[] in uiStuff
  orbs = data.orbs;
  //send information to the server with player coor
  setInterval(() => {
    socket.emit("tick", { xVector: player.xVector, yVector: player.yVector });
  }, 33);
});

socket.on("tock", (data) => {
  // console.log("tock client: ", data);
  //update players
  players = data.players;
  player.locX = data.playerX;
  player.locY = data.playerY;
});
