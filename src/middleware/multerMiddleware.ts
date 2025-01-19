import multer from "multer";
import path from "path";
import fs from "fs";

// Allowed file types
const ALLOWED_FILE_TYPES = /jpeg|jpg|png|gif/;
const uploadDir = path.join(__dirname, "../../uploads");

if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Upload directory
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${uniqueSuffix}${path.extname(file.originalname)}`);
  },
});

// File filter for validating file types
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const extname = ALLOWED_FILE_TYPES.test(
    path.extname(file.originalname).toLowerCase()
  );
  const mimetype = ALLOWED_FILE_TYPES.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true); // Accept file
  } else {
    cb(
      new Error(
        "Unsupported file type. Only JPEG, JPG, PNG, and GIF files are allowed!"
      )
    );
  }
};

// Multer middleware
export const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB size limit
  },
  fileFilter,
});
