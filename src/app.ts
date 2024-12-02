// src/app.ts
import express, { NextFunction, Request, Response } from "express";
import { errorHandler } from "./middleware/errorHandler";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { json, urlencoded } from "body-parser";
import apiRoutes from "./routes";
import Diary from "./models/Diary";
import JwtHelper from "./helpers/jwt";

const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Register routes
app.use(apiRoutes); // Use the grouped routes

// Error handling middleware (optional)
app.use(errorHandler);

export default app;
