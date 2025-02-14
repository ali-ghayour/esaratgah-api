import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";
import { CustomError } from "../helpers/CustomError";
import { RUser } from "../types";
import User from "../models/User";

const SECRET_KEY = process.env.JWT_SECRET || "your_secret_key";
const FRONTEND_URL = process.env.FRONT_URL;

export const setupSocket = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: {
      origin: FRONTEND_URL, // Adjust in production
      methods: ["GET", "POST"],
    },
  });

  // Middleware to authenticate users before connecting to Socket.io
  io.use(async (socket, next) => {
    const token = socket.handshake.auth?.token; // Get token from handshake
    if (!token) {
      return next(new CustomError("No token provided", 401));
    }

    try {
      const decoded = jwt.verify(token, SECRET_KEY) as RUser; // Verify token
      const user = await User.findById(decoded._id); // Get user from DB

      if (!user) {
        return next(new CustomError("User not found", 401));
      }

      socket.data.user = user; // Attach user data to socket
      next(); // Proceed to connection
    } catch (error) {
      return next(new CustomError("Invalid or expired token", 401));
    }
  });

  io.on("connection", (socket) => {
    console.log(`⚡ User connected: ${socket.data.user.full_name}`);

    socket.on("sendMessage", ({ recipientId, message }) => {
      if (!recipientId || !message) return;

      // Emit message to recipient
      io.to(`user:${recipientId}`).emit("receiveMessage", {
        sender: socket.data.user._id,
        message,
      });
    });

    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.data.user.full_name}`);
    });
  });
};
