function joinNs(url) {
  nsSocket = io(`http://localhost:8000${url}`);
  //room information for this particular client
  nsSocket.on("nsRoomLoad", (nsRooms) => {
    // console.log(nsRooms);
    let roomList = document.querySelector(".room-list");
    //update room-list
    roomList.innerHTML = "";
    nsRooms.forEach((room, i) => {
      const liRoom = document.createElement("li");
      const spanRoom = document.createElement("span");
      spanRoom.classList.add(
        "glyphicon",
        `${room.privateRoom ? "glyphicon-lock" : "glyphicon-globe"}`
      );

      spanRoom.innerText = " " + room.roomTitle;
      liRoom.appendChild(spanRoom);
      roomList.appendChild(liRoom);
      //add a click listener on each room
      liRoom.addEventListener("click", () => {
        alert(`clicked ${room.roomTitle}`);
      });
      //add user to the room
      if (i === 0) {
        const topRoomName = room.roomTitle;
        joinRoom(topRoomName);
      }
    });
  });

  //get value from text area
  document
    .querySelector(".message-form")
    .addEventListener("submit", (event) => {
      event.preventDefault();
      const message = document.querySelector("#user-message").value;
      //send value to the server
      nsSocket.emit("newMessageToServer", {
        text: message,
      });
    });

  nsSocket.on("messageToClient", (message) => {
    const listOfMessages = document.querySelector("#messages");
    const mesg = buildHTML(message);
    listOfMessages.appendChild(mesg);
    message.text.value = "";
  });
}

const buildHTML = (message) => {
  const { text, time, username, avatar } = message;
  const str = `<li>
      <div class="user-image">
        <img src=${avatar} />
      </div>
      <div class="user-message">
        <div class="user-name-time">
          ${username} <span>${new Date(time).toLocaleTimeString()}</span>
        </div>
        <div class="message-text">${text}</div>
      </div>
    </li>`;

  //parse string to node
  const stringToNode = new DOMParser()
    .parseFromString(str, "text/html")
    .querySelector("li");

  return stringToNode;
};
