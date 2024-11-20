export class CustomError extends Error {
    public statusCode: number;
    public errors?: { [key: string]: string[] };
  
    constructor(message: string, statusCode: number, errors?: { [key: string]: string[] }) {
      super(message);
      this.statusCode = statusCode;
      this.errors = errors;
      Error.captureStackTrace(this, this.constructor);
    }
  }