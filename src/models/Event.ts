import { Schema } from "mongoose";
import { connection, autoIncrement } from "../config/db";
import User from "./User";

const EventSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    participated_users: [
      { type: Number, reqired: true, unique: true, ref: User },
    ],
    invited_users: [{ type: Number, reqired: true, unique: true, ref: User }],
    created_by: { type: Number, required: true, ref: User },
  },
  {
    timestamps: true,
  }
);

EventSchema.plugin(autoIncrement.plugin, "Event");

EventSchema.index({ user_id: 1 });
EventSchema.index({ name: 1 });
EventSchema.index({ slug: 1 });

const Event = connection.model("Event", EventSchema);
export default Event;
