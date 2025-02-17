import { Request, Response } from "express";
import {
  createChat,
  sendMessage,
  getMessages,
} from "../../services/ChatService/chatService";

export const startChat = async (req: Request, res: Response) => {
  try {
    const { user1, user2 } = req.body;
    const chat = await createChat(user1, user2);
    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ error: "Error starting chat" });
  }
};

export const postMessage = async (req: Request, res: Response) => {
  try {
    const { chatId, sender, text } = req.body;
    const message = await sendMessage(chatId, sender, text);
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: "Error sending message" });
  }
};

export const fetchMessages = async (req: Request, res: Response) => {
  try {
    const { chatId } = req.params;
    const messages = await getMessages(chatId);
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: "Error fetching messages" });
  }
};
