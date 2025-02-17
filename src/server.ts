import app from "./app";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer } from "http"; // Create HTTP server for Socket.io
import { Server as SocketIOServer } from "socket.io";
import initializeSocket from "./config/socket";

dotenv.config();

const PORT = process.env.PORT || 3000;
const DB_URI = process.env.DB_URI as string;

if (!DB_URI) {
  console.error("❌ Missing DB_URI in environment variables.");
  process.exit(1);
}

console.log(`🚀 Starting server on port ${PORT}`);
console.log(`🔗 Connecting to MongoDB: ${DB_URI}`);

// Create HTTP server
const server = createServer(app);

// Attach Socket.io setup
const io = new SocketIOServer(server, {
  cors: { origin: "*" },
});

initializeSocket(io);

// Connect to MongoDB
mongoose
  .connect(DB_URI)
  .then(() => {
    console.log("✅ Connected to MongoDB");

    // Start the server
    server.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
    process.exit(1);
  });

// Handle database connection errors
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});

mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB disconnected. Attempting to reconnect...");
});
