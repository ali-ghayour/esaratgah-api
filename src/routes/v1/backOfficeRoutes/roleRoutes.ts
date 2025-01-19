import express from "express";
import roleController from "../../../controllers/backOfficeControllers/roleController";
import {checkPermission} from "../../../middleware/checkPermission";
import { authenticateUser } from "../../../middleware/authenticateUser";

const router = express.Router();

router.get("/permissions", roleController.getPermissions);
router.post(
  "/role",
  authenticateUser(),
  checkPermission("roleManagement", "create"),
  roleController.create
);
router.get(
  "/roles/query",
  authenticateUser(),
  checkPermission("roleManagement", "read"),
  roleController.get
);
router.get(
  "/role/:_id",
  authenticateUser(),
  checkPermission("roleManagement", "read"),
  roleController.getRoleById
);
router.put(
  "/role/:_id",
  authenticateUser(),
  checkPermission("roleManagement", "write"),
  roleController.update
);
router.delete(
  "/role/:_id",
  authenticateUser(),
  checkPermission("roleManagement", "delete"),
  roleController.delete
);

export default router;
