import { Schema } from "mongoose";
import { connection, autoIncrement } from "../config/db";
import User from "./User";
import Chat from "./Chat";

export interface IMessage extends Document {
  _id: number;
  chatId: number;
  sender: number; // User ID
  text: string;
  seenBy: number[]; // User IDs who have read the message
}

const MessageSchema = new Schema<IMessage>(
  {
    chatId: { type: Number, required: true, ref: Chat },
    sender: { type: Number, ref: User, required: true },
    text: { type: String, required: true },
    seenBy: [{ type: Number, ref: User }],
  },
  {
    timestamps: true,
  }
);

MessageSchema.plugin(autoIncrement.plugin, "Message");
// MessageSchema.post("save", async function () {
//   const User = connection.model("User");
//   await User.updateMany({ role: this._id }, { permissions: this.permissions });
// });
MessageSchema.index({ sender: 1, text: 1 });

const Message = connection.model("Message", MessageSchema);
export default Message;
