import jwt from "jsonwebtoken";
import { CustomError } from "../helpers/CustomError";
import { Request, Response, NextFunction } from "express";
import { RUser } from "../types";

// Middleware to authenticate and attach user to req.user
export const authenticateUser =
  () => (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(" ")[1]; // Assuming Bearer token format

    if (!token) {
      return next(new CustomError("No token provided", 401));
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET as string
      ) as RUser; // Verify and decode token
      req.user = decoded; // Attach the user object to the request
      next();
    } catch (error) {
      return next(new CustomError("Invalid or expired token", 401)); // Handle invalid token
    }
  };
