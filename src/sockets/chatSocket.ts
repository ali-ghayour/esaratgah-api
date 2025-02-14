import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";

export const setupSocket = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Allow all origins (Adjust for production security)
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`⚡ New client connected: ${socket.id}`);

    // Example: Listen for chat messages
    socket.on("sendMessage", (data) => {
      console.log("📩 Message received:", data);
      io.emit("receiveMessage", data); // Broadcast to all users
    });

    // Handle user disconnect
    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });
};
