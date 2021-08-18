function joinNs(url) {
  const nsSocket = io(`http://localhost:8000${url}`);
  //room information for this particular client
  nsSocket.on("nsRoomLoad", (nsRooms) => {
    console.log(nsRooms);
    let roomList = document.querySelector(".room-list");
    //update room-list
    roomList.innerHTML = "";
    nsRooms.forEach((room) => {
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
    });
  });
}
