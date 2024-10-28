require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();

const port = process.env.PORT || 5000;

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});
io.on("connection", (socket) => {
  console.log(socket.id);

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
  socket.on("disconnect", () => {
    console.log("client disconnected");
  });
});

server.listen(port, () => console.log(`server listening on port ${port}`));
