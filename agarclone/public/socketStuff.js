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
  //orbs[] in uiStuff
  orbs = data.orbs;
});
