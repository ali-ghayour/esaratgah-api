import { Schema } from "mongoose";
import { connection, autoIncrement } from "../config/db";
import User from "./User";

const DiarySchema = new Schema(
  {
    title: { type: String, required: false },
    content: { type: String, required: false },
    user_id: { type: Number, required: true, ref: User },
  },
  {
    timestamps: true,
  }
);

DiarySchema.plugin(autoIncrement.plugin, "Diary");

const Diary = connection.model("Diary", DiarySchema);
export default Diary;
