// src/app.ts
import express, { NextFunction, Request, Response } from "express";
import { errorHandler } from "./middleware/errorHandler";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { json, urlencoded } from "body-parser";
import apiRoutes from "./routes";
import GlobalPermissions from "./helpers/Permissions";


// const test = new GlobalPermissions
// test.setAllPermissions(true);
// console.log(test.getPermissions);
const app = express();

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(json());
app.use('/uploads', express.static('uploads')); // Serve uploaded files
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// Register routes
app.use(apiRoutes); // Use the grouped routes

// Error handling middleware (optional)
app.use(errorHandler);

export default app;
