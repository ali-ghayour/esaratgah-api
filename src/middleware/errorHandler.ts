import { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { CustomError } from "../helpers/CustomError";
import { IResponse } from "../types";

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response<IResponse<null>>,
  next: NextFunction
): void => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  const response: IResponse<null> = {
    payload: {
      message,
      errors: err.errors || { general: [message] },
    },
  };

  if (process.env.NODE_ENV !== "production") {
    console.error(err); // Log the error for debugging
  }

  res.status(statusCode).json(response);
};
