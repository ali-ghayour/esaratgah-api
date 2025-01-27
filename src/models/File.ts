import { Schema, Document } from "mongoose";
import { connection, autoIncrement } from "../config/db";
import User from "./User";

export interface IFile extends Document {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  sizes: {
    small: string; // Path to small version
    medium: string; // Path to medium version
    large: string; // Path to large version
  };
  created_by: number;
}

const FileSchema = new Schema<IFile>(
  {
    originalName: { type: String, required: true },
    fileName: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    sizes: {
      small: { type: String, required: true },
      medium: { type: String, required: true },
      large: { type: String, required: true },
    },
    created_by: { type: Number, required: false, ref: User },
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
