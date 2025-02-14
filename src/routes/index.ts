import express from "express";
import backofficeAuthV1 from "./v1/backOfficeRoutes/authRoutes";
import backOfficeUserV1 from "./v1/backOfficeRoutes/userRoutes"
import backOfficeRoleV1 from "./v1/backOfficeRoutes/roleRoutes"
import backOfficeFileV1 from "./v1/backOfficeRoutes/fileRoutes";
import userRoutesV1 from "./v1/userRoutes";
import diaryRoutesV1 from "./v1/diaryRoutes";
import userFakerRoutes from "./v1/seed/userFakerRoutes";
import diaryFakerRoutes from "./v1/seed/diaryFakerRoutes";
import RolesSeederRoutes from "./v1/seed/rolesSeederRoutes";
import chatRoutesV1 from "./v1/chatRoutes";
// import userRoutesV2 from "./v2/userRoutes";
// import diaryRoutesV2 from "./v2/diaryRoutes";

const router = express.Router();

// Version 1 routes
router.use("/api/v1/users", userRoutesV1);
router.use("/api/v1/diaries", diaryRoutesV1);
router.use("/api/v1/seeder/user", userFakerRoutes);
router.use("/api/v1/seeder/diary", diaryFakerRoutes);
router.use("/api/v1/seeder/roles", RolesSeederRoutes);

/* backoffice routes V1*/
router.use("/api/v1/backoffice", backofficeAuthV1);
router.use("/api/v1/backoffice", backOfficeUserV1);
router.use("/api/v1/backoffice", backOfficeRoleV1);
router.use("/api/v1/backoffice", backOfficeFileV1);

/* chat routes V1*/
router.use("/api/v1/chat", chatRoutesV1);
// // Version 2 routes
// router.use("/api/v2/users", userRoutesV2);
// router.use("/api/v2/diaries", diaryRoutesV2);

export default router;
