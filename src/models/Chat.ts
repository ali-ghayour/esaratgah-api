import { Schema } from "mongoose";
import { connection, autoIncrement } from "../config/db";
import User from "./User";
import Message from "./Message";

export interface IChat extends Document {
  _id: number;
  participants: number[]; // User IDs of participants
  setting: {
    isGroup: boolean;
    groupName?: string;
    creator?: number;
  }
}

const ChatSchema = new Schema<IChat>(
  {
    participants: [{ type: Number, ref: User, required: true }],
    setting: {
      isGroup: { type: Boolean, required: true, default: false },
      groupName: { type: String, required: false },
      creator: { type: Number, required: false, ref: User }
    }
  },
  {
    timestamps: true,
  }
);

ChatSchema.plugin(autoIncrement.plugin, "Chat");
// ChatSchema.post("save", async function () {
//   const User = connection.model("User");
//   await User.updateMany({ role: this._id }, { permissions: this.permissions });
// });
ChatSchema.index({ members: 1, messages: 1 });

const Chat = connection.model("Chat", ChatSchema);
export default Chat;
