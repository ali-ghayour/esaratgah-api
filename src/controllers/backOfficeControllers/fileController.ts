import { Request, Response } from "express";
import sharp from "sharp";
import fs from "fs"; // For filesystem operations
import File, { IFile } from "../../models/File"; // Your database model for file storage
import path from "path";

// Upload file controller
export class fileController {
  static uploadFile = async (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ message: "No file uploaded or unsupported file type." });
      }

      const { path: filePath, filename } = req.file;
      const uploadDir = "uploads/";

      // Create resized versions of the image
      const smallPath = `${uploadDir}small-${filename}`;
      const mediumPath = `${uploadDir}medium-${filename}`;
      const largePath = `${uploadDir}large-${filename}`;

      // Resize images using Sharp
      await sharp(filePath)
        .resize({ width: 150 }) // Small size
        .toFile(smallPath);

      await sharp(filePath)
        .resize({ width: 500 }) // Medium size
        .toFile(mediumPath);

      await sharp(filePath)
        .resize({ width: 1200 }) // Large size
        .toFile(largePath);

      // Save file info to the database
      const fileData = await File.create({
        originalName: req.file.originalname,
        fileName: filename,
        mimeType: req.file.mimetype,
        // filePath: filePath,
        size : req.file.size,
        sizes: {
          small: `uploads/small-${filename}`,
          medium: `uploads/medium-${filename}`,
          large: `uploads/large-${filename}`,
        },
        created_by : req.user?._id
      });

      res.status(201).json({
        message: "File uploaded successfully!",
        file: fileData,
      });
    } catch (error: any) {
      res.status(500).json({
        message: error.message || "An error occurred during file upload.",
      });
    }
  };

  // Get all files controller
  static getFiles = async (req: Request, res: Response) => {
    try {
      const files = await File.find(); // Fetch all files
      res.status(200).json(files);
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Failed to fetch files." });
    }
  };

  // Delete file controller
  static deleteFile = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      const file = await File.findById(id);
      if (!file) {
        return res.status(404).json({ message: "File not found." });
      }

      // Delete files from disk
      fs.unlinkSync(path.join(__dirname, "../../", file.sizes.small));
      fs.unlinkSync(path.join(__dirname, "../../", file.sizes.medium));
      fs.unlinkSync(path.join(__dirname, "../../", file.sizes.large));
      fs.unlinkSync(path.join(__dirname, "../../uploads", file.fileName));

      // Delete from database
      await File.findByIdAndDelete(id);

      res.status(200).json({ message: "File deleted successfully!" });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Failed to delete file." });
    }
  };
}
