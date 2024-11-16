// src/models/User.ts
import { Document, Schema } from "mongoose";
import { connection, autoIncrement } from "../config/db";
import Role, { IRole, IRolePopulated } from "./Role";
import Permission, { IPermission } from "./Permission";

export interface IUser extends Document {
  user_id: number;
  name: string;
  familly: string;
  username: string;
  phone_number: string;
  password: string;
  role: number[];
  permissions: number[];
  camp: string;
  categories: Array<string>;
  files: { total_file: number; total_file_size: number };
}

export interface IUserPopulated extends Omit<IUser, "role" | "permissions"> {
  role: IRole[]; // Populated roles
  permissions: IPermission[]; // Populated permissions
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, requred: true },
    familly: { type: String, requred: true },
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
