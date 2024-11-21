import express, { NextFunction, Request, Response } from "express";
import backofficeAuthV1 from "./v1/backOfficeRoutes/auth/authRoutes";
import userRoutesV1 from "./v1/userRoutes";
import diaryRoutesV1 from "./v1/diaryRoutes";
import userFakerRoutes from "./v1/seed/userFakerRoutes";
import diaryFakerRoutes from "./v1/seed/diaryFakerRoutes";
import PermissionsSeederRoutes from "./v1/seed/permissionsSeederRoutes"
// import userRoutesV2 from "./v2/userRoutes";
// import diaryRoutesV2 from "./v2/diaryRoutes";

const router = express.Router();

// Version 1 routes
router.use("/api/v1/users", userRoutesV1);
router.use("/api/v1/diaries", diaryRoutesV1);
router.use("/api/v1/seeder/user", userFakerRoutes);
router.use("/api/v1/seeder/diary", diaryFakerRoutes);
router.use("/api/v1/seeder/permissions", PermissionsSeederRoutes);

/* backoffice routes V1*/
router.use("/api/v1/backoffice", backofficeAuthV1);

// // Version 2 routes
// router.use("/api/v2/users", userRoutesV2);
// router.use("/api/v2/diaries", diaryRoutesV2);

export default router;
