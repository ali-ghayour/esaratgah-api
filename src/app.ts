// src/app.ts
import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { json, urlencoded } from "body-parser";
import apiRoutes from "./routes";
import User from "./models/User";
import Diary from "./models/Diary";

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // await Diary.create({
    //   title: "test",
    //   // phone_number: "09358441163",
    //   // password: "12345",
    //   user_id: 1,
    // });
    const diary = await Diary.findOne().populate("user", "username");
    res.status(200).json({
      success: true,
      diary,
      status: 200,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// Register routes
app.use(apiRoutes); // Use the grouped routes

// Error handling middleware (optional)
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).send("Something went wrong!");
  }
);

export default app;
