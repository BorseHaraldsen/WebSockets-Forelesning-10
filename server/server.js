import express from "express";
import * as path from "path";
import cookieParser from "cookie-parser";
import { WebSocketServer } from "ws";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const cookieSecret = process.env.COOKIE_SECRET;
app.use(express.json());
app.use(cookieParser(cookieSecret));

app.use(express.static("../client/dist/"));

app.post("/api/login", (req, res) => {
  res.cookie("username", req.body.credentials, { signed: true });
  res.sendStatus(201);
});
app.use((req, res, next) => {
  if (req.method === "GET" && !req.path.startsWith("/api")) {
    res.sendFile(path.resolve("../client/dist/index.html"));
  } else {
    next();
  }
});
const webSocketServer = new WebSocketServer({ noServer: true });
const server = app.listen(process.env.PORT || 3000);
const sockets = [];

server.on("upgrade", (req, socket, head) => {
  webSocketServer.handleUpgrade(req, socket, head, (socket) => {
    sockets.push(socket);
    socket.send("hello from the server");

    socket.on("message", (message) => {
      console.log(message.toString());

      for (const s of sockets) {
        s.send(message.toString());
      }
    });
  });
});
