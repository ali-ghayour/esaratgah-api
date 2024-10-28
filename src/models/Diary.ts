// src/models/Diary.ts
import { Schema } from "mongoose";
import { connection, autoIncrement } from "../config/db"

// Define your schema
const DiarySchema = new Schema({
  title: { type: String, required: false },
  content: { type: String, required: false },
  // other fields...
});


// Apply the auto-increment plugin to a specific field (e.g., _id or another identifier)
DiarySchema.plugin(autoIncrement.plugin, {
  model: "Diary", // The name of the model
  field: "diaryId", // The field you want to auto-increment
  startAt: 1, // Starting value
  incrementBy: 1, // Increment by
});

// Export the model using the shared connection
export default connection.model("Diary", DiarySchema);
