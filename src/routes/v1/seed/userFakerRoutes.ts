import express, { NextFunction, Request, Response } from "express";
import createDummyUsers from "../../../test/faker/userFaker";
import User from "../../../models/User";

const router = express.Router();

router.post(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await createDummyUsers(5);
      res.status(200).json({
        success: true,
        users,
      });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
);

router.delete(
  "/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await User.deleteMany();
      res.status(200).json({
        success: true,
        deleted,
      });
    } catch (error) {}
  }
);

export default router;
