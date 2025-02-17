import { Server, Socket } from "socket.io";
import redisClient from "../config/redis";

const onlineUsersKey = "online_users";

const registerNotificationHandlers = (io: Server, socket: Socket) => {
  socket.on("send_friend_request", async ({ senderId, receiverId }) => {
    console.log(`🤝 Friend request from ${senderId} to ${receiverId}`);

    // Save friend request to DB (example)
    // await FriendRequestModel.create({ senderId, receiverId });

    // Notify receiver if online
    const receiverSocketId = await redisClient.hget(onlineUsersKey, receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new_friend_request", { senderId });
      console.log(`🔔 Friend request notification sent to ${receiverId}`);
    }
  });
};

export default registerNotificationHandlers;
