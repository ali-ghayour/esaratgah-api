import { Request, Response, NextFunction } from "express";
import { CustomError } from "../helpers/CustomError";
import { IUserPopulated } from "../models/User"; // Adjust according to your models
import { havePermission } from "../helpers/havePermission";

/**
 * Middleware to check if a user has the required permission for a specific controller and action.
 * @param controller - The name of the controller (e.g., "userController").
 * @param action - The specific action (e.g., "read", "write", "create", "delete").
 * @returns Middleware function for permission checking.
 */
export const checkPermission =
  (controller: string, action: "read" | "write" | "create" | "delete") =>
  (req: Request, res: Response, next: NextFunction) => {
    try {
      // Get the authenticated user from the request
      const user = req.user as IUserPopulated | undefined;

      if (!user) {
        throw new CustomError("Unauthorized", 401, {
          user: ["User is not authenticated"],
        });
      }

      // Check if the user has the required permission
      const hasPermission = havePermission(controller, action, user);

      if (!hasPermission) {
        throw new CustomError("Forbidden", 403, {
          permission: ["User does not have the required permissions"],
        });
      }

      next(); // Proceed to the next middleware or route handler
    } catch (err) {
      next(err); // Pass the error to the error handler
    }
  };
