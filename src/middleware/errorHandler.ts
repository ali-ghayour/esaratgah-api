import { Request, Response, NextFunction } from "express";
import { CustomError } from "../helpers/CustomError";
import { IResponse } from "../types";

export const errorHandler = (
  err: any, // Handle all types of errors
  req: Request,
  res: Response<IResponse<null>>,
  next: NextFunction
): void => {
  // Set default status code and message
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Log the error in non-production environments
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  // Handle custom errors
  if (err instanceof CustomError) {
    res.status(statusCode).json({
      payload: {
        message: err.message,
        errors: err.errors || {},
      },
    });
    return;
  }

  // Handle Multer-specific errors (file upload)
  if (err.code === "LIMIT_FILE_SIZE") {
    res.status(400).json({
      payload: {
        message: "File size exceeds the allowed limit.",
        errors: { file: ["File size exceeds the allowed limit"] },
      },
    });
    return;
  }

  if (err.code === "LIMIT_UNEXPECTED_FILE") {
    res.status(400).json({
      payload: {
        message: "Too many files uploaded.",
        errors: { file: ["Exceeds the allowed number of files"] },
      },
    });
    return;
  }

  // Fallback for other errors
  res.status(statusCode).json({
    payload: {
      message,
      errors: err.errors || { general: [message] },
    },
  });
};
