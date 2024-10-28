import express from "express";
import diaryController from "../../controllers/diaryController";

const router = express.Router();

router.get("/");
router.post("/create", diaryController.create);

export default router;
