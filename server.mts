import { createServer } from "http";
import { Server } from "socket.io";
import next from "next";
import { Socket } from "socket.io-client";

const dev = process.env.NODE_ENV !== "production";

const hostname = process.env.HOSTNAME || "localhost";

const port = parseInt(process.env.PORT || "3000");

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpserver = createServer(handle);

  const io = new Server(httpserver, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("A user connected:", socket.id);

    // Handle joining a room
    socket.on("joinRoom", (roomId: string, username: string) => {
      socket.join(roomId);
      console.log(`${username} joined room ${roomId}`);
      // Notify others in the room
      socket
        .to(roomId)
        .emit("user_Joined", `${username} has joined the${roomId}`);
    });

    socket.on("message", ({ message, roomId, sender }) => {
      console.log(`Message from ${sender} in room ${roomId}: ${message}`);

      socket.to(roomId).emit("message", {
        sender: "system",
        message: message,
      });
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected:", socket.id);
    });
  });

  httpserver.listen(port, () => {
    console.log(`Server is running on http://${hostname}:${port}`);
  });
});
