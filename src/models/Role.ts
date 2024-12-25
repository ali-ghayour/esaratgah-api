import { Schema } from "mongoose";
import { connection, autoIncrement } from "../config/db";
// import Permission, { IPermission } from "./Permission";

export interface IRole extends Document {
  _id: number;
  name: string;
  slug: string;
  permissions: {
    [key: string]: {
      read: boolean;
      write: boolean;
      create: boolean;
      delete: boolean;
    };
  };
}

// export interface IRolePopulated extends Omit<IRole, "permissions"> {
//   permissions: IPermission[];
// }

const RoleSchema = new Schema<IRole>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    permissions: { type: Object, required: true },
  },
  {
    timestamps: true,
  }
);

RoleSchema.plugin(autoIncrement.plugin, "Role");

RoleSchema.index({ name: 1 });

const Role = connection.model("Role", RoleSchema);
export default Role;
