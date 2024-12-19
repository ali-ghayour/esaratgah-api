import express, { NextFunction, Request, Response } from "express";
import createRoles from "../../../test/seeders/RoleSeeder";

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    await createRoles();
    res.status(200).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// router.get(
//   "/delete",
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       const deleted = await User.deleteMany();
//       res.status(200).json({
//         success: true,
//         deleted,
//       });
//     } catch (error) {}
//   }
// );

export default router;
