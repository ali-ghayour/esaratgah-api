import express, { Request, Response, NextFunction } from "express";
import userController from "../../../controllers/backOfficeControllers/userController";
// import checkPermission from "../../../../middleware/checkPermission";

const router = express.Router();

router.get("/users/query", userController.get);
router.get("/user/:_id", userController.getUserById);
router.put("/user/:_id", userController.update);
router.delete("/user/:_id", userController.delete);
// router.post("/request_otp", userController.request_otp);
// router.post("/verify_token", userController.getUserByToken);
// router.post("/logout", userController.logout);

export default router;
