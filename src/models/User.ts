import { Document, Schema, UpdateQuery } from "mongoose";
import { connection, autoIncrement } from "../config/db";
import Role, { IRole } from "./Role";
import Upload from "./Upload";

export interface AuthModel {
  api_token: string;
  refreshToken?: string;
}

export interface ChatSettings {
  notifications: boolean;
  last_seen: boolean;
}

export interface IUser extends Document {
  _id: number;
  name: string;
  family: string;
  full_name: string;
  phone_number: string;
  password?: string;
  role?: number;
  permissions: {
    [key: string]: {
      read: boolean;
      write: boolean;
      create: boolean;
      delete: boolean;
    };
  };
  camp?: string;
  categories?: Array<string>;
  files?: { total_file: number; total_file_size: number };
  otp?: { code: string; expire_at: number };
  pic?: number;
  language?: "en" | "fa";
  status: "pending" | "active" | "locked";
  deleted?: boolean;
  auth?: AuthModel;
  contacts?: number[];
  chat_settings?: ChatSettings;
}

export interface IUserPopulated extends Omit<IUser, "role"> {
  role: IRole; // Populated roles
}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    family: { type: String, required: true },
    full_name: { type: String, required: false },
    phone_number: { type: String, required: true, unique: true },
    password: { type: String, required: false },
    role: { type: Number, required: false, ref: Role },
    permissions: { type: Object, required: false },
    camp: { type: String },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    files: {
      total_file: { type: Number, default: 0 },
      total_file_size: { type: Number, default: 0 },
    },
    otp: {
      code: { type: String, required: false },
      expire_at: { type: Number, required: false },
    },
    pic: { type: Number, ref: Upload },
    language: { type: String, enum: ["en", "fa"], default: "en" },
    auth: {
      api_token: { type: String },
      refreshToken: { type: String },
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "active", "locked"],
      default: "active",
    },
    deleted: { type: Boolean, default: false },

    // Chat-related fields
    contacts: [{ type: Number, ref: "User" }],
    chat_settings: {
      notifications: { type: Boolean, default: true },
      last_seen: { type: Boolean, default: true },
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.plugin(autoIncrement.plugin, "User");

UserSchema.pre("save", async function (next) {
  this.full_name = this.name + " " + this.family;
  if (this.isNew && this.role) {
    const role = await Role.findById(this.role);
    if (role) {
      this.permissions = role.permissions;
    }
  }
  next();
});

UserSchema.pre("findOneAndUpdate", async function (next) {
  const update = this.getUpdate() as UpdateQuery<IUser>;
  if (update.name && update.family) {
    update.full_name = update.name + " " + update.family;
  }
  if (update.role) {
    const role = await Role.findById(update.role);
    if (role) {
      update.permissions = role.permissions;
    }
  }
  next();
});

// Indexes
UserSchema.index({ full_name: 1 });
UserSchema.index({ phone_number: 1 });
UserSchema.index({ camp: 1 });
UserSchema.index({ contacts: 1 });

const User = connection.model("User", UserSchema);
export default User;
