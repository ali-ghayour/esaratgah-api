import express, { Request, Response, NextFunction } from "express";
import authController from "../../../controllers/backOfficeControllers/authController";
// import checkPermission from "../../../../middleware/checkPermission";

const router = express.Router();

router.post("/login", authController.login);
router.post("/request_otp", authController.request_otp);
router.post("/verify_token", authController.getUserByToken);
router.post("/logout", authController.logout);

export default router;
