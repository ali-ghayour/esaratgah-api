import User, { IUserPopulated } from "../models/User"; // Adjust according to your models
import { RUser } from "../types";

/**
 * Helper function to check if a user has the required permission for a specific controller and action.
 * @param controller - The name of the controller (e.g., "userController").
 * @param action - The specific action (e.g., "read", "write", "create", "delete").
 * @param user - The user object consist of _id and phone_number.
 * @returns True if the user has the required permission, false otherwise.
 */
export const havePermission = async (
  controller: string,
  action: "read" | "write" | "create" | "delete",
  user: RUser
) => {
  try {
    // Check if the user has permissions for the given controller
    const us = await User.findById(user._id);
    const userPermissions = us!.permissions; // Assuming `permissions` is an object with controllers and actions

    // Example structure:
    // user.permissions = {
    //   userController: { read: true, write: false, create: true, delete: false }
    // }

    if (!userPermissions[controller]) {
      return false; // Controller-level permission not found
    }

    // Check if the specific action is allowed
    return userPermissions[controller][action] === true;
  } catch (err) {
    // In case of error, deny access by default
    return false;
  }
};
