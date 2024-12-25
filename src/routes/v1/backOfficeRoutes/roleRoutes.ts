import express from "express";
import roleController from "../../../controllers/backOfficeControllers/roleController";
// import checkPermission from "../../../../middleware/checkPermission";

const router = express.Router();

router.get("/permissions", roleController.getPermissions);
router.post("/role", roleController.create);
router.get("/roles/query", roleController.get);
// router.get("/user/:_id", userController.getUserById);
// router.delete("/user/:_id", userController.delete);

export default router;
