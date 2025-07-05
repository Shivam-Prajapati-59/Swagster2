import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const hostname = process.env.HOSTNAME || "localhost";
const port = parseInt(process.env.PORT || "3000");

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  // Create HTTP server for Next.js
  const httpserver = createServer(handle);

  // Initialize Socket.IO with proper CORS configuration
  const io = new Server(httpserver, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  // Handle socket connections
  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle joining a room
    socket.on("joinRoom", (data) => {
      const { roomId, username } = data;

      // Join the specified room
      socket.join(roomId);

      // Store user info in socket for later use
      socket.data.username = username;
      socket.data.roomId = roomId;

      console.log(`${username} joined room ${roomId}`);

      // Notify others in the room that a new user joined
      socket.to(roomId).emit("user_Joined", `${username} has joined the room`);
    });

    // Handle incoming messages
    socket.on("message", (data) => {
      const { message, roomId, sender } = data;

      console.log(`Message from ${sender} in room ${roomId}: ${message}`);

      // Broadcast message to all users in the room except sender
      socket.to(roomId).emit("message", {
        sender: sender, // Fixed: Use actual sender name instead of "system"
        message: message,
      });
    });

    // Handle user disconnection
    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);

      // Notify room members if user was in a room
      if (socket.data.roomId && socket.data.username) {
        socket
          .to(socket.data.roomId)
          .emit("user_Joined", `${socket.data.username} has left the room`);
      }
    });
  });

  // Start the server
  httpserver.listen(port, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
  });
});
