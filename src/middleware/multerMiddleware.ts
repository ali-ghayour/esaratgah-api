import multer from "multer";
import path from "path";
import fs from "fs";
import { Request, Response, NextFunction } from "express";

const ALLOWED_FILE_TYPES = /jpeg|jpg|png|gif/;
const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const extname = ALLOWED_FILE_TYPES.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = ALLOWED_FILE_TYPES.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Unsupported file type. Only JPEG, JPG, PNG, and GIF files are allowed!"
      )
    );
  }
};

export const uploadMiddleware = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter,
}).array("files", 20); // Multiple file support

export const handleFileUpload = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  uploadMiddleware(req, res, (err) => {
    if (err) {
      return next(err);
    }
    next(); // Pass to the next middleware
  });
};
