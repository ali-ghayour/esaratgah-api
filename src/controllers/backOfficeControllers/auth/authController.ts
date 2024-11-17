import { Request, Response, NextFunction } from "express";
import User from "../../../models/User";

export interface ILogin {
  phone_number: string;
  otp: string;
}

export interface IRequestOTP {
  phone_number: string;
}

const authController = class {
  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone_number, otp } = req.body as ILogin;
      const user = await User.findOne({ phone_number });
    } catch (error) {
      console.log(error);
      next(error);
    }
  };

  static request_otp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { phone_number } = req.body as IRequestOTP;
    } catch (error) {}
  };

  static logout = async () => {};
};

export default authController;
