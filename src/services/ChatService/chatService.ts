import Chat from "../../models/Chat";
import Message from "../../models/Message";

export const createChat = async (user1: number, user2: number) => {
  return await Chat.findOneAndUpdate(
    { participants: { $all: [user1, user2] }, isGroup: false },
    { participants: [user1, user2] },
    { upsert: true, new: true }
  );
};

export const sendMessage = async (
  chatId: number,
  sender: number,
  text: string
) => {
  const message = new Message({ chatId, sender, text });
  await message.save();
  return message;
};

export const getMessages = async (chatId: string) => {
  return await Message.find({ chatId })
    .sort({ createdAt: 1 })
    .populate("sender");
};
