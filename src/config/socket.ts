import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import redisClient from "./redis";
import registerChatHandlers from "../sockets/chat";
import registerNotificationHandlers from "../sockets/notifications";
import { RUser } from "../types";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key"; // Use a secure env variable
const onlineUsersKey = "online_users"; // Redis key for online users

const initializeSocket = (io: SocketIOServer) => {
  io.on("connection", async (socket: Socket) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) {
        console.log("❌ No token provided, disconnecting socket.");
        return socket.disconnect();
      }

      // Verify JWT token
      const decoded = jwt.verify(token, JWT_SECRET) as RUser;
      if (!decoded || !decoded._id) {
        console.log("❌ Invalid token, disconnecting socket.");
        return socket.disconnect();
      }

      const userId = decoded._id;
      console.log(`✅ User ${userId} connected with socket ID: ${socket.id}`);

      // Store user in Redis
      await redisClient.hset(onlineUsersKey, userId, socket.id);

      // Register event handlers
      registerChatHandlers(io, socket);
    //   registerChatHandlers(io, socket, userId);
    //   registerNotificationHandlers(io, socket, userId);
      registerNotificationHandlers(io, socket);

      socket.on("disconnect", async () => {
        console.log(`❌ Socket disconnected: ${socket.id}`);
        await redisClient.hdel(onlineUsersKey, `${userId}`);
        console.log(`🔴 User ${userId} is now offline`);
      });
    } catch (error:any) {
      console.log("❌ Authentication error:", error.message);
      socket.disconnect();
    }
  });
};

export default initializeSocket;
