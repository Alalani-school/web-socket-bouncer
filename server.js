import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
const app = express();
const server = http.createServer(app);
let now = new Date();
const welcomeMessage = {
  "TYPE":"WELCOME",
  "MESSAGE":"Sucessfully connected to server",
  "DATE":now
}
let onlineUsers = [];
app.use(express.static("public"));
const wss = new WebSocketServer({ server });
wss.on("connection", (ws) => {
  console.log("client connected");
  ws.send(JSON.stringify(welcomeMessage));
  ws.on("message", (message) => {
    console.log("received:", message.toString());
    if(message !== "[PING]") {
      let jsonMessage = JSON.parse(message.toString());
      if(jsonMessage.TYPE === "LOGON") onlineUsers.push(jsonMessage.MESSAGE);
      else if(jsonMessage.TYPE == "LOGOFF") if(onlineUsers.indexOf(jsonMessage.MESSAGE) > -1) onlineUsers.splice(onlineUsers.indexOf(jsonMessage.MESSAGE), 1);
      let Data = {
        "TYPE":"ONLINE",
        "MESSAGE":onlineUsers
      }
      for(const client of wss.clients) if (client.readyState === client.OPEN) client.send(JSON.stringify(Data));
    }
    else {
      for (const client of wss.clients) {
        if (client.readyState === client.OPEN && client !== ws) client.send(message.toString());
      }
    }
  });
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, "0.0.0.0", () => {
  console.log(`server running on port ${PORT}`);
});
