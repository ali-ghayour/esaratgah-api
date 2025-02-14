import { Router } from "express";
import {
  startChat,
  postMessage,
  fetchMessages,
} from "../../controllers/chatController";

const router = Router();

router.post("/start", startChat); // Start a chat
router.post("/send", postMessage); // Send a message
router.get("/:chatId", fetchMessages); // Get chat messages

export default router;
