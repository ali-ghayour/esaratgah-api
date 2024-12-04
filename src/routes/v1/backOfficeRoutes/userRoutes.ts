import express, { Request, Response, NextFunction } from "express";
import userController from "../../../controllers/backOfficeControllers/user/userController";
// import checkPermission from "../../../../middleware/checkPermission";

const router = express.Router();

router.get("/users/query", userController.get);
// router.post("/request_otp", userController.request_otp);
// router.post("/verify_token", userController.getUserByToken);
// router.post("/logout", userController.logout);

export default router;
