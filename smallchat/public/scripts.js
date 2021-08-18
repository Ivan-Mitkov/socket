//get socket.io
const socket = io("http://localhost:8000");
//get value from text area
document
  .querySelector("#message-form")
  .addEventListener("submit", (event) => {
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