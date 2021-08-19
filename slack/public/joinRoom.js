function joinRoom(roomName) {
  //send this room to the server
  //3 arg is callback for getting info from the server
  nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    //update the room member total after joining
    document.querySelector(
      ".curr-room-num-users"
    ).innerHTML = `${newNumberOfMembers} <span class="glyphicon glyphicon-user">`;
  });
}
