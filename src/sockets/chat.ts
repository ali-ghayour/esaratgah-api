import { Server, Socket } from "socket.io";
import redisClient from "../config/redis";

const onlineUsersKey = "online_users";

const registerChatHandlers = (io: Server, socket: Socket) => {
  socket.on("send_message", async ({ senderId, receiverId, message }) => {
    console.log(`📩 Message from ${senderId} to ${receiverId}: ${message}`);

    // Store message in DB (example - replace with real DB logic)
    // await MessageModel.create({ senderId, receiverId, message });

    // Check if receiver is online
    const receiverSocketId = await redisClient.hget(onlineUsersKey, receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("receive_message", { senderId, message });
      console.log(`✅ Message sent to user ${receiverId}`);
    }
  });
};

export default registerChatHandlers;
