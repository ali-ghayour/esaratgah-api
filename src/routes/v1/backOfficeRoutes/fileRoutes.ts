import express from "express";
import { fileController } from "../../../controllers/backOfficeControllers/fileController";
import { checkPermission } from "../../../middleware/checkPermission";
import { authenticateUser } from "../../../middleware/authenticateUser";
import { asyncHandler } from "../../../helpers/asyncHandler";
import { upload } from "../../../middleware/multerMiddleware";

const router = express.Router();

router.post(
  "/file",
  // authenticateUser(),
  // checkPermission("fileManagement", "create"),
  upload.single('file'),
  asyncHandler(fileController.uploadFile)
);
router.get(
  "/file",
  // authenticateUser(),
  // checkPermission("fileManagement", "read"),
  asyncHandler(fileController.getFiles)
);
router.delete(
  "/file/:id",
  // authenticateUser(),
  // checkPermission("fileManagement", "delete"),
  asyncHandler(fileController.deleteFile)
);

export default router;
