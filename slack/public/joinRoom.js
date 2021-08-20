function joinRoom(roomName) {
  //send this room to the server
  //3 arg is callback for getting info from the server
  nsSocket.emit("joinRoom", roomName, (newNumberOfMembers) => {
    updateCurrentRoom(newNumberOfMembers, roomName);
  });
  //get history from server
  nsSocket.on("historyCatchUp", (history) => {
    updateHistory(history);
  });

  //listen to updated members in the room
  nsSocket.on("updateMembers", (newNumberOfMembers) => {
    updateCurrentRoom(newNumberOfMembers, roomName);
  });

  //search input
  searchMessages();
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

function searchMessages() {
  const searchInput = document.getElementById("search-box");

  searchInput.addEventListener("input", (e) => {
    // console.log(e.target.value);
    let searchTerm = e.target.value.toLowerCase();
    let messages = [...document.querySelectorAll("#messages > li")].map((t) => {
      t.style.display = "block";
      if (
        t.children[1].children[1].innerHTML
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      ) {
        return t;
      } else {
        return (t.style.display = "none");
      }
    });
    if (searchTerm === "") {
      messages.map((x) => (x.style.display = "block"));
    }
  });
}
