import express, { Request, Response, NextFunction } from "express";
import { fileController } from "../../../controllers/backOfficeControllers/fileController";
import { checkPermission } from "../../../middleware/checkPermission";
import { authenticateUser } from "../../../middleware/authenticateUser";
import { asyncHandler } from "../../../helpers/asyncHandler";
import { handleFileUpload } from "../../../middleware/multerMiddleware";

const router = express.Router();

router.post(
  "/file",
  authenticateUser(),
  // checkPermission("fileManagement", "create"),
  handleFileUpload,
  asyncHandler(fileController.uploadFile)
);
router.get(
  "/files/query",
  // authenticateUser(),
  // checkPermission("fileManagement", "read"),
  asyncHandler(fileController.getFiles)
);
router.get(
  "/user/:_id",
  authenticateUser(),
  checkPermission("userManagement", "read"),
  asyncHandler(fileController.getFileById)
  // userController.getUserById
);
router.delete(
  "/file/:_id",
  // authenticateUser(),
  // checkPermission("fileManagement", "delete"),
  asyncHandler(fileController.deleteFile)
);

router.get(
  "/file",
  // authenticateUser(),
  // checkPermission("userManagement", "read"),
  asyncHandler(fileController.getTotalFilesInfo)
  // userController.getUserById
);

export default router;
