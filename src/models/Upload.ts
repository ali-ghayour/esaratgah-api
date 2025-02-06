import { Schema, Document, model } from "mongoose";
import { connection, autoIncrement } from "../config/db";
import UserModel from "./User"; // Ensure the User model file path is correct

export interface IUpload extends Document {
  originalName: string;
  fileName: string;
  mimeType: string;
  size: number;
  sizes: {
    small: string;
    medium: string;
    large: string;
  };
  created_by: number;
}

const uploadSchema = new Schema<IUpload>(
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
    created_by: { type: Number, ref: "User", required: false },
  },
  {
    timestamps: true,
  }
);

uploadSchema.plugin(autoIncrement.plugin, { model: "Upload" });

uploadSchema.index({ created_by: 1 });

const Upload = connection.model<IUpload>("Upload", uploadSchema);

export default Upload;
