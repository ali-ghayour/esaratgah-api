// src/models/User.ts
import { Schema } from "mongoose";
import { connection, autoIncrement } from "../config/db";

interface UserType {
  user_id: number;
  username: string;
  phone_number: string;
  password: string;
  role: Array<string>;
  camp: string;
  categories: Array<string>;
}

// Define your schema
const UserSchema = new Schema<UserType>(
  {
    username: { type: String, required: true, unique: true },
    phone_number: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: [String],
      enum: ["super-admin", "admin", "diary-manager", "writer"],
    },
    camp: { type: String },
    categories: ["objectId"],
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(autoIncrement.plugin, "User");

UserSchema.index({ user_id: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ phone_nimber: 1 });

const User = connection.model("User", UserSchema);
export default User;
