import { Request, Response, NextFunction } from "express";
import User, { IUserPopulated } from "../../../models/User";
import { IRequest } from "../../../types";
import { CustomError } from "../../../helpers/CustomError";
import { havePermission } from "../../../helpers/havePermission";
import { createNumber } from "../../../helpers/createNumber";
import { IRolePopulated } from "../../../models/Role";

export interface ILogin {
  phone_number: string;
  otp: string;
}

const authController = class {
  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone_number, code } = req.body as IRequest;
      const user = (await User.findOne({
        phone_number,
      }).populate("permissions")) as unknown as IUserPopulated;

      if (!user) {
        throw new CustomError("Invalid phone number", 404, {
          phone_number: ["Invalid phone number"],
        });
      }

      // code is valid
      if (code !== user.otp.code) {
        throw new CustomError("Invalid code", 404, {
          code: ["Invalid code"],
        });
      }

      // user have permission
      if (!havePermission(["backOfficeLogin"], user)) {
        throw new CustomError("You don't have permission", 403, {
          Permission: ["Access denied!"],
        });
      }

      // return authMode
      const api_token = "qekljteklqngkneqg";
      await User.updateOne({ phone_number }, { "auth.api_token": api_token });
      res.status(200).json({ api_token });
    } catch (error) {
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
      const user = (await User.findOne({
        phone_number,
      }).populate("permissions")) as unknown as IUserPopulated;

      // validate user exists
      if (!user) {
        throw new CustomError("Invalid phone number", 404, {
          phone_number: ["Invalid phone number"],
        });
      }

      // validate user have permission
      if (!havePermission(["backOfficeLogin"], user)) {
        throw new CustomError("You don't have permission", 403, {
          Permission: ["Access denied!"],
        });
      }

      // create opt, send to user and assign it to user
      const code = await createNumber(6);
      const expire_at = Date.now() + 120000;

      user.otp.code = code;
      user.otp.expire_at = expire_at;
      user.save();

      console.log(code);
      // response
      res.status(203).json({
        sent_code: true,
      });
    } catch (error) {
      next(error);
    }
  };

  static getUserByToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { api_token } = req.body;

      const user = await User.findOne({ "auth.api_token": api_token });

      if (!user) {
        throw new CustomError("Invalid token!", 404);
      }

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

  static logout = async () => {};
};

export default authController;
