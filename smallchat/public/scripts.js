//get socket.io
const socket = io("http://localhost:8000");
const adminSocket = io("http://localhost:8000/admin");
// socket.on("connect", () => {
//   console.log("Client connect to main namespace");

//   console.log(socket.id);
// });
adminSocket.on("welcome", (dataFromServer) => {
  console.log("Client connect to admin namespace");
  console.log(adminSocket.id);
  console.log(dataFromServer);
});
//joining room from the main namespace
socket.on("joined", (data) => {
  console.log(data);
});
//get value from text area
document.querySelector("#message-form").addEventListener("submit", (event) => {
  event.preventDefault();
  const message = document.querySelector("#user-message").value;
  //send value to the server
  socket.emit("userMessageToServer", {
    data: message,
  });
});
//receive value from the server
socket.on("userMessageToClient", (message) => {
  const listOfMessages = document.querySelector("#messages");
  const singleMessage = document.createElement("li");
  listOfMessages.appendChild(singleMessage).innerText = message.data;
  let text = document.querySelector("#user-message");
  text.value = "";
});
