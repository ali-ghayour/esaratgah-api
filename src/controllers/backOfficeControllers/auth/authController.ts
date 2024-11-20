import { Request, Response, NextFunction } from "express";
import User from "../../../models/User";
import {IRequest} from "../../../types"

export interface ILogin {
  phone_number: string;
  otp: string;
}

const authController = class {
  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone_number, otp } = req.body as ILogin;
      const user = await User.findOne({ phone_number });
      if(!user){
        res.status(400).json({
        })
      }
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
      const { phone_number } = req.body as IRequest;
      const user = await User.findOne({phone_number})
    } catch (error) {}
  };

  static logout = async () => {};
};

export default authController;
