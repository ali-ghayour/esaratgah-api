import { Document, Schema, UpdateQuery } from "mongoose";
import { connection, autoIncrement } from "../config/db";
import User from "./User";

export interface IFriendRequest extends Document {
  sender_id: number;
  receiver_id: number;
  status: string;
}

const FriendRequestSchema = new Schema<IFriendRequest>(
  {
    sender_id: { type: Number, required: true, ref: User },
    receiver_id: { type: Number, required: true, ref: User },
    status: {
      type: String,
      required: true,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

FriendRequestSchema.plugin(autoIncrement.plugin, "FriendRequest");

FriendRequestSchema.index({ sender_id: 1, receiver_id: 1 });

const FriendRequest = connection.model("FriendRequest", FriendRequestSchema);

export default FriendRequest;
