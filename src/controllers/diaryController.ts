import { Request, Response } from "express";
import Diary from "../models/Diary";

const diaryController = class diaryController {
  static create = async (req: Request, res: Response) => {
    try {
      const newDiary = new Diary(req.body);
      const savedDiary = await newDiary.save();
      res.status(201).json(savedDiary);
    } catch (error: any) {
      res.status(400).json({ message: error.message });
    }
  };
};

export default diaryController;
