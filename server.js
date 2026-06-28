import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
const app = express();
const server = http.createServer(app);
app.use(express.static("public"));
const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
  console.log("client connected");
  ws.send("connected to server");
  ws.on("message", (message) => {
    console.log("received:", message.toString());
    for (const client of wss.clients) {
      if (client.readyState === client.OPEN && client !== ws) {
        client.send(message.toString());
      }
    }
  });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`server running on port ${PORT}`);
});
