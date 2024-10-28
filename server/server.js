require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");
const app = express();

const port = process.env.PORT || 5000;
const staticPath = path.resolve(__dirname, "dist");
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log("client connected");
  socket.on("sensorData", (data) => {
    socket.broadcast.emit("sensorData", data);
    // console.log(data);
  });
  socket.on("send-message", (data) => {
    console.log("Mensaje recibido:", data);
    // Enviar el mensaje recibido a todos los clientes conectados
    io.emit("receive-message", data);
  });
  socket.on("send-web-message", (data) => {
    console.log("Mensaje recibido:", data);
    // Enviar el mensaje recibido a todos los clientes conectados
    io.emit("web-receive-message", data);
  });
  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

if (process.env.Node_ENV === "production") {
  app.get("*", (req, res) => {
    app.use(express.static(staticPath));
    const indexFile = path.join(__dirname, "dist", "index.html");
    res.sendFile(indexFile);
  });
}

server.listen(port, () => console.log(`server listening on port ${port}`));
