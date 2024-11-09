// src/models/Diary.ts
import { Schema } from "mongoose";
import { connection, autoIncrement } from "../config/db";
import User from "./User"; // Make sure the path is correct

// Define your schema
const DiarySchema = new Schema(
  {
    diary_id: { type: Number },
    title: { type: String, required: false },
    content: { type: String, required: false },
    user_id: { type: Number, required: true },
  },
  {
    timestamps: true, // This adds `createdAt` and `updatedAt` fields
  }
);

// Apply the auto-increment plugin to a specific field (e.g., _id or another identifier)
DiarySchema.plugin(autoIncrement.plugin, {
  model: "Diary", // The name of the model
  field: "_id", // The field you want to auto-increment
  startAt: 1, // Starting value
  incrementBy: 1, // Increment by
});

DiarySchema.virtual("user", {
  ref: User,
  localField: "user_id", // Field in Diary
  foreignField: "user_id", // Field in User
  justOne: true, // Each diary has one user
});

// Export the model using the shared connection
export default connection.model("Diary", DiarySchema);
