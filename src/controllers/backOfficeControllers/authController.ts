import { Request, Response, NextFunction } from "express";
import User, { IUserPopulated } from "../../models/User";
import { IRequest } from "../../types";
import { CustomError } from "../../helpers/CustomError";
import { havePermission } from "../../helpers/havePermission";
import { createNumber } from "../../helpers/createNumber";
import JwtHelper, { IToken } from "../../helpers/jwt";
import bcryptHelper from "../../helpers/bcryptHelper"; // Assuming you have a bcrypt helper
import { createResponse } from "../../helpers/Query/QueryResponse";

export interface ILogin {
  phone_number: string;
  otp: string;
}

const authController = class {
  /**
   * Handles user login.
   * Validates phone number, checks OTP, verifies permissions, and generates a JWT token.
   */
  static login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { phone_number, code } = req.body as IRequest;

      // Fetch user and populate permissions
      const user = (await User.findOne({
        phone_number,
      })) as unknown as IUserPopulated; //   "permissions" // .populate(

      // Validate user existence
      if (!user) {
        throw new CustomError("Invalid phone number", 404, {
          phone_number: ["Invalid phone number"],
        });
      }

      // Validate OTP
      if (code !== user.otp!.code || Date.now() > user.otp!.expire_at) {
        throw new CustomError("Invalid or expired OTP", 400, {
          code: ["Invalid or expired OTP"],
        });
      }

      // Check user permissions
      if (!havePermission("backofficeAccess", "read", user)) {
        throw new CustomError("You don't have permission", 403, {
          permission: ["Access denied!"],
        });
      }

      // Generate JWT token
      const jwtHelper = new JwtHelper({
        secret: process.env.JWT_SECRET as string,
        expiresIn: "7d",
      });
      const payload = { _id: user._id, phone_number: user.phone_number };
      const api_token = jwtHelper.generateToken(payload);

      // Save token in the database
      await User.updateOne({ phone_number }, { "auth.api_token": api_token });

      res.status(200).json({ api_token });
    } catch (error) {
      next(error); // Pass error to global error handler
    }
  };

  /**
   * Handles OTP requests.
   * Generates and sends an OTP to the user and saves it in the database.
   */
  static request_otp = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { phone_number } = req.body as IRequest;

      // Fetch user and populate permissions
      const user = (await User.findOne({ phone_number }).populate(
        "permissions"
      )) as unknown as IUserPopulated;

      // Validate user existence
      if (!user) {
        throw new CustomError("Invalid phone number", 404, {
          phone_number: ["Invalid phone number"],
        });
      }

      // Check user permissions
      if (!havePermission("backofficeAccess", "read", user)) {
        throw new CustomError("You don't have permission", 403, {
          permission: ["Access denied!"],
        });
      }

      // Generate OTP
      const code = await createNumber(6);
      const expire_at = Date.now() + 120000; // OTP expires in 2 minutes

      // Save OTP in the database
      user.otp = { code, expire_at };
      await user.save();

      console.log(`OTP sent: ${code}`); // Log for debugging; replace with actual SMS service

      res.status(203).json(
        createResponse(
          { sent_code: true ,expire_at},
          {
            message: `OTP sent successfully to phone number ${phone_number}`,
          }
        )
      );
    } catch (error) {
      next(error); // Pass error to global error handler
    }
  };

  /**
   * Retrieves user information by decoding the provided JWT token.
   */
  static getUserByToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { api_token } = req.body;

      // Verify the token
      const jwtHelper = new JwtHelper({
        secret: process.env.JWT_SECRET as string,
      });
      const decoded = jwtHelper.verifyToken(api_token) as IToken;

      // Find the user by decoded ID
      const user = await User.findById(decoded._id);
      if (!user) {
        throw new CustomError("User not found", 404);
      }

      res.status(200).json(user);
    } catch (error) {
      next(error); // Pass error to global error handler
    }
  };

  /**
   * Handles user logout by clearing the token from the database.
   */
  static logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { api_token } = req.body;

      // Verify the token
      const jwtHelper = new JwtHelper({
        secret: process.env.JWT_SECRET as string,
      });
      const decoded = jwtHelper.verifyToken(api_token) as IToken;

      // Clear the user's token in the database
      await User.updateOne({ _id: decoded._id }, { "auth.api_token": null });

      res.status(200).json({ message: "Successfully logged out" });
    } catch (error) {
      next(error); // Pass error to global error handler
    }
  };

  /**
   * Handles password reset or change.
   * (Optional to implement if required)
   */
  // static resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  //   try {
  //     const { phone_number, new_password } = req.body;

  //     // Fetch user
  //     const user = await User.findOne({ phone_number });
  //     if (!user) {
  //       throw new CustomError("Invalid phone number", 404, {
  //         phone_number: ["Invalid phone number"],
  //       });
  //     }

  //     // Hash the new password
  //     user.password = await bcryptHelper.hash(new_password);
  //     await user.save();

  //     res.status(200).json({ message: "Password successfully updated" });
  //   } catch (error) {
  //     next(error); // Pass error to global error handler
  //   }
  // };
};

export default authController;
