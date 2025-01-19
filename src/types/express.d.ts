import { IRequest, IResponse } from "./index"; // Adjust the path

declare global {
  namespace Express {
    export interface Request {
      body: IRequest; // Add your custom request type
      user?: { _id: number; phone_number: string }; // Example: Add authenticated user info
    }

    export interface Response<T = any> {
      json: (body: IResponse<T>) => this; // Add your custom response type
    }
  }
}
