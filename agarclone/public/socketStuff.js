let socket = io.connect("http://localhost:8000");

socket.on("init", (data) => {
  //orbs[] in uiStuff
  orbs=data.orbs
});
