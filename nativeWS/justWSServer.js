import http from "http";
import WebSocket, { WebSocketServer } from "ws";

const server = http.createServer((req, res) => {
  res.end("I'm connected");
});
//https://npm.io/package/ws
const wss = new WebSocketServer({
  server,
});
wss.on("headers", (headers, req) => {
  console.log(headers);
  // console.log(req.headers);
});

wss.on("connection", (ws, req) => {
  // console.log(ws);
  // console.log(req);
  ws.send("Welcome to the land of sockets :) ");
  ws.on("message", (msg) => {
    console.log("MESSAGE FROM CLIENT: ", msg.toString());
    setTimeout(() => {
      ws.send(msg.toString());
    }, 3000);
  });
});
server.listen(5500, () => {
  console.log("Server listen on 5500");
});
