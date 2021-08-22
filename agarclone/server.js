import express from "express";
import * as path from "path";
import helmet from "helmet";
import { Server } from "socket.io";

export const app = express();
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);
const __dirname = path.resolve(path.dirname(""));

app.use(express.static(path.join(__dirname, "/public")));
//create express server
const expressServer = app.listen(8000, () => {
  console.log("server listen on port 8000");
});
// create socket.io server and pass express server
export const io = new Server(expressServer, {
  cors: {
    origin: "*",
  },
});
