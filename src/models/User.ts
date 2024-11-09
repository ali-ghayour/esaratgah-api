// src/models/User.ts
import { Schema } from "mongoose";
import { connection, autoIncrement } from "../config/db";

interface User {
  user_id: number;
  username: string;
  phone_number: string;
  password: string;
  role: Array<string>;
  camp: string;
  categories: Array<string>;
}

// Define your schema
const UserSchema = new Schema<User>(
  {
    user_id: { type: Number, reqired: true },
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

// Apply the auto-increment plugin to a specific field (e.g., _id or another identifier)
UserSchema.plugin(autoIncrement.plugin, {
  model: "User", // The name of the model
  field: "_id", // The field you want to auto-increment
  startAt: 1, // Starting value
  incrementBy: 1, // Increment by
});

UserSchema.index({ user_id: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ phone_nimber: 1 });

// Export the model using the shared connection
export default connection.model("User", UserSchema);
