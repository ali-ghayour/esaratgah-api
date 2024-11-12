import { Schema } from "mongoose";
import { connection, autoIncrement } from "../config/db";

export interface IPermission extends Document {
  _id: number;
  name: string;
  slug: string;
  description: string;
}

const PermissionSchema = new Schema<IPermission>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

PermissionSchema.plugin(autoIncrement.plugin, "Permission");

PermissionSchema.index({ name: 1 });

const Permission = connection.model("Permission", PermissionSchema);
export default Permission;
