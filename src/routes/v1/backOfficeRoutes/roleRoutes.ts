import express from "express";
import roleController from "../../../controllers/backOfficeControllers/roleController";
// import checkPermission from "../../../../middleware/checkPermission";

const router = express.Router();

router.get("/permissions", roleController.getPermissions);
router.post("/role", roleController.create);
router.get("/roles/query", roleController.get);
router.get("/role/:_id", roleController.getRoleById);
router.put("/role/:_id", roleController.update);
router.delete("/role/:_id", roleController.delete);

export default router;
