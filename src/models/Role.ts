import { Schema } from "mongoose";
import { connection, autoIncrement } from "../config/db";
import Permission from "./Permission";

export interface IRole extends Document {
  _id: number;
  name: string;
  slug: string;
  permissions: number[];
}

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    permissions: [{ type: Number, required: true, ref: Permission }],
  },
  {
    timestamps: true,
  }
);

RoleSchema.plugin(autoIncrement.plugin, "Role");

RoleSchema.index({ name: 1 });

const Role = connection.model("Role", RoleSchema);
export default Role;
