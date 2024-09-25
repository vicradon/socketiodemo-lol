const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: (origin, callback) => {
      if (origin.includes("localhost:") || origin.includes("127.0.0.1:")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    credentials: true,
  },
});

function getRandomNotification() {
  const messages = [
    "New message from Alice",
    "Your package has shipped",
    "Meeting at 3 PM",
    "You have a new follower",
    "Password change successful",
  ];

  return {
    id: Math.floor(Math.random() * 1000),
    message: messages[Math.floor(Math.random() * messages.length)],
    timestamp: new Date().toISOString(),
  };
}

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  const notificationInterval = setInterval(() => {
    const randomNotification = getRandomNotification();
    socket.emit("allNotification", randomNotification);
    console.log("Emitted notification:", randomNotification);
  }, 5000);

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
    clearInterval(notificationInterval);
  });
});

const PORT = process.env.PORT || 3500;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
