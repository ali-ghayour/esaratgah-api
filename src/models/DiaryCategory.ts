import { Schema } from "mongoose";
import { connection, autoIncrement } from "../config/db";
import User from "./User";

const DiaryCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    parent_id: { type: String, required: false },
    created_by: { type: Number, required: true, ref: User },
  },
  {
    timestamps: true,
  }
);

DiaryCategorySchema.plugin(autoIncrement.plugin, "DiaryCategory");

const DiaryCategory = connection.model("DiaryCategory", DiaryCategorySchema);
export default DiaryCategory;
