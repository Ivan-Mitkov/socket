//get socket.io
const socket = io("http://localhost:8000");

//listen for nsList - list of all namespaces
//socket is connected to the main namespace
socket.on("nsList", (nsData) => {
  console.log(nsData);
  //update DOM with namespaces
  let domNamespaces = document.querySelector(".namespaces");
  if (domNamespaces.childElementCount > 0) {
    Array.from(domNamespaces.childNodes).forEach((el) => el.remove());
  }
  nsData.forEach((ns) => {
    let singleNamespace = document.createElement("div");
    singleNamespace.classList.add("namespace");
    let namespaceImage = document.createElement("img");
    namespaceImage.setAttribute("src", ns.img);
    namespaceImage.setAttribute("ns", ns.endpoint);
    singleNamespace.appendChild(namespaceImage);
    domNamespaces.appendChild(singleNamespace);
    //add a click listener to each namespace
    singleNamespace.addEventListener("click", () => {
      const singleNSenpoint = ns.endpoint;
      alert(`clicked ${singleNSenpoint}`);
    });
  });
  const nsSocket = io("http://localhost:8000/wiki");
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
});
