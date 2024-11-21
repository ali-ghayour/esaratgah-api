import { Request, Response, NextFunction } from "express";
import { CustomError } from "../helpers/CustomError";
import { IUser, IUserPopulated } from "../models/User"; // Adjust according to your models
import { IPermission } from "../models/Permission";

export const havePermission = (
  requiredPermissions: Array<IPermission["name"]>,
  user: IUserPopulated 
): boolean => {
  try {
    const userPermissions = user.permissions.map((perm) => perm.name);

    const hasPermission = requiredPermissions.some((required) =>
      userPermissions.includes(required)
    );
    if (!hasPermission) {
      return false;
    }

    return true;
  } catch (err) {
    return false;
  }
};
