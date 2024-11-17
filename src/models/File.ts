import { Schema, Document } from "mongoose";
import { connection, autoIncrement } from "../config/db";
import User from "./User";

export interface IFile extends Document {
  name: string;
  type: string;
  path: string;
  size: number;
  status: string;
  created_by: number;
}

const FileSchema = new Schema<IFile>(
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
    created_by: { type: Number, required: true, ref: User },
  },
  {
    timestamps: true,
  }
);

FileSchema.plugin(autoIncrement.plugin, "File");

FileSchema.index({ created_by: 1 });
FileSchema.index({ status: 1 });

const File = connection.model("File", FileSchema);
export default File;
