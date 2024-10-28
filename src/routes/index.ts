import express from "express";
import userRoutesV1 from "./v1/userRoutes";
import diaryRoutesV1 from "./v1/diaryRoutes";
// import userRoutesV2 from "./v2/userRoutes";
// import diaryRoutesV2 from "./v2/diaryRoutes";

const router = express.Router();

// Version 1 routes
router.use("/api/v1/users", userRoutesV1);
router.use("/api/v1/diaries", diaryRoutesV1);

// // Version 2 routes
// router.use("/api/v2/users", userRoutesV2);
// router.use("/api/v2/diaries", diaryRoutesV2);

export default router;
