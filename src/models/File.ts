import { Schema } from "mongoose";
import { connection, autoIncrement } from "../config/db";
import User from "./User";

const FileSchema = new Schema(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    path: { type: String, required: true },
    size: { type: Number, required: true },
    status: {
      type: String,
      require: true,
      enum: ["pend", "rejected", "approved"],
      default: "pend",
    },
    user_id: { type: Number, required: true, ref: User },
  },
  {
    timestamps: true,
  }
);

FileSchema.plugin(autoIncrement.plugin, "File");

FileSchema.index({ user_id: 1 });
FileSchema.index({ status: 1 });

const File = connection.model("File", FileSchema);
export default File;
