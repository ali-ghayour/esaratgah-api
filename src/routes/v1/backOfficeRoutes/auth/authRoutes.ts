import express, { Request, Response, NextFunction } from "express";
import authController from "../../../../controllers/backOfficeControllers/auth/authController";
import checkPermission from "../../../../middleware/checkPermission";

const router = express.Router();

router.post("/login", authController.login);
// router.post("/");

export default router;
