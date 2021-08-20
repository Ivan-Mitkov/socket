function joinRoom(roomName) {
  //send this room to the server
  //3 arg is callback for getting info from the server
  nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    updateCurrentRoom(newNumberOfMembersр, roomName);
  });
  //get history from server
  nsSocket.on("historyCatchUp", (history) => {
    updateHistory(history);
  });

  //listen to updated members in the room
  nsSocket.on("updateMembers", (newNumberOfMembers) => {
    updateCurrentRoom(newNumberOfMembers, roomName);
  });
}

function updateHistory(history) {
  const listOfHistoryMessages = document.querySelector("#messages");
  listOfHistoryMessages.innerHTML = "";
  history.forEach((msg) => {
    const htmlMsg = buildHTML(msg);
    listOfHistoryMessages.appendChild(htmlMsg);
  });
  //scroll to the end of messages
  listOfHistoryMessages.scrollTo(0, listOfHistoryMessages.scrollHeight);
}

function updateCurrentRoom(newMembers, roomName) {
  //update the room member total after joining
  document.querySelector(
    ".curr-room-num-users"
  ).innerHTML = `${newMembers} <span class="glyphicon glyphicon-user">`;
  document.querySelector(".curr-room-text").innerText = `${roomName}`;
}
