const chatForm = document.getElementById("chat-form");
const messages = document.querySelector(".chat-messages");

const socket = io();

socket.on("message", (msg) => {
  // console.log(msg);
  outputMessageToDOM(msg);
  //Scroll down
  messages.scrollTop = messages.scrollHeight;
});

//access chat form
chatForm.addEventListener("submit", submitMessage);

//Output message
function outputMessageToDOM(msg) {
  const div = document.createElement("div");
  div.classList.add("message");
  div.innerHTML = ` <p class="meta">${msg.username} <span>${msg.time}</span></p>
                      <p class="text">
                        ${msg.text}
                      </p>`;
  messages.appendChild(div);
}

//event listeners
function submitMessage(e) {
  e.preventDefault();
  //target form get its element with id msg, get the value
  const msg = e.target.elements.msg.value;
  //Emit message to the server
  socket.emit("chatMessage", msg);
  //Clear form input
  e.target.elements.msg.value = "";
  //focus on text input
  e.target.elements.msg.focus();
}
