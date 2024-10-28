// src/app.ts
import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { json, urlencoded } from "body-parser";
// import routes from "./routes"; // Import your routes

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Register routes
// app.use("/api", routes); // Prefix for your API routes

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
