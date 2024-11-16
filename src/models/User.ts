// src/models/User.ts
import { Document, Schema } from "mongoose";
import { connection, autoIncrement } from "../config/db";
import Role from "./Role";
import Permission from "./Permission";

export interface IUser extends Document {
  user_id: number;
  username: string;
  phone_number: string;
  password: string;
  role: number[];
  permissions: Array<number>;
  camp: string;
  categories: Array<string>;
  files: { total_file: number; total_file_size: number };
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    phone_number: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: [
      {
        type: Number,
        reqired: false,
        ref: Role,
      },
    ],
    permissions: [{ type: Number, reqired: false, ref: Permission }],
    camp: { type: String },
    categories: ["objectId"],
    files: {
      total_file: { type: Number, required: false, default: 0 },
      total_file_size: { type: Number, required: false, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(autoIncrement.plugin, "User");

UserSchema.index({ user_id: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ phone_number: 1 });

const User = connection.model("User", UserSchema);
export default User;
