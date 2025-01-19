import express, { Request, Response, NextFunction } from "express";
import userController from "../../../controllers/backOfficeControllers/userController";
import { checkPermission } from "../../../middleware/checkPermission";
import { authenticateUser } from "../../../middleware/authenticateUser";

const router = express.Router();

router.get(
  "/users/query",
  authenticateUser(),
  checkPermission("userManagement", "read"),
  userController.get
);
router.get(
  "/user/:_id",
  authenticateUser(),
  checkPermission("userManagement", "read"),
  userController.getUserById
);
router.put(
  "/user/:_id",
  authenticateUser(),
  checkPermission("userManagement", "write"),
  userController.update
);
router.delete(
  "/user/:_id",
  authenticateUser(),
  checkPermission("userManagement", "delete"),
  userController.delete
);
// router.post("/request_otp", userController.request_otp);
// router.post("/verify_token", userController.getUserByToken);
// router.post("/logout", userController.logout);

export default router;
