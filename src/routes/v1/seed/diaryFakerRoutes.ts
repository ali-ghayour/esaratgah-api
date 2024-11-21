import express, { NextFunction, Request, Response } from "express";
import createDummyDiary from "../../../test/faker/diaryFaker";
import Diary from "../../../models/Diary";

const router = express.Router();

router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await createDummyDiary(5);
      // console.log(users);
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

router.get(
  "/delete",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const deleted = await Diary.deleteMany();
      res.status(200).json({
        success: true,
        deleted,
      });
    } catch (error) {}
  }
);

export default router;
