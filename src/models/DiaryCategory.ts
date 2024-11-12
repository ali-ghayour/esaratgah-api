import { Schema } from "mongoose";
import { connection, autoIncrement } from "../config/db";
import User from "./User";
import File from "./File";

const DiaryCategorySchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    parent_id: { type: String, required: false },
    created_by: { type: Number, required: true, ref: User },
    main_picture: { type: Number, ref: File, unique: true },
  },
  {
    timestamps: true,
  }
);

DiaryCategorySchema.plugin(autoIncrement.plugin, "DiaryCategory");

DiaryCategorySchema.index({ parent_id: 1 });
DiaryCategorySchema.index({ name: 1 });
DiaryCategorySchema.index({ slug: 1 });

const DiaryCategory = connection.model("DiaryCategory", DiaryCategorySchema);
export default DiaryCategory;
