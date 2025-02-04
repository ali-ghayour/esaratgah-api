import { NextFunction, Request, Response } from "express";
import { PipelineStage } from "mongoose";
// import { promises as fs } from "fs"; // For filesystem operations
import fs from "fs";
import File, { IFile } from "../../models/File"; // Your database model for file storage
import path from "path";
import { buildAggregationPipeline } from "../../helpers/Query/AggregationPipeline";
import { generatePaginationLinks } from "../../helpers/Query/GeneratePaginationLinks";
import { createResponse } from "../../helpers/Query/QueryResponse";
import { imageResizer } from "../../helpers/imageResizer";
import { CustomError } from "../../helpers/CustomError";

// Upload file controller
export class fileController {
  static uploadFile = async (req: Request, res: Response) => {
    try {
      if (!req.files || !Array.isArray(req.files) || req.files.length === 0) {
        return res.status(400).json({
          message: "No files uploaded or unsupported file types.",
        });
      }

      const uploadDir = "uploads/";
      req.files.forEach(async (file) => {
        const { path: filePath, filename } = file;

        // Create resized versions of the image
        const sizes = [
          { width: 150, fileName: `small-${filename}` },
          { width: 500, fileName: `medium-${filename}` },
          { width: 1200, fileName: `large-${filename}` },
        ];

        await imageResizer(filePath, uploadDir, sizes);

        // Save file info to the database
        const fileData = await File.create({
          originalName: file.originalname,
          fileName: filename,
          mimeType: file.mimetype,
          // filePath: filePath,
          size: file.size,
          sizes: {
            small: `uploads/small-${filename}`,
            medium: `uploads/medium-${filename}`,
            large: `uploads/large-${filename}`,
          },
          created_by: req.user?._id,
        });
      });

      res.status(201).json({
        message: "File uploaded successfully!",
        // file: fileData,
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
      const { page, items_per_page, search, sort, order ,...filters} = req.query;

      // Convert query params to the expected types
      const queryOptions = {
        page: Number(page) || 1,
        items_per_page: (Number(items_per_page) || 10) as 10 | 30 | 50 | 100,
        search: search as string,
        sort: sort as string,
        order: order as "asc" | "desc",
        ...filters
      }

      // Define searchable fields
      const searchableFields = ["fileName", "originalName", "phone_number"]; // Adjust fields based on your schema

      // Define selectable fields
      const selectFields: Record<string, 0 | 1> = {
        originalName: 1,
        fileName: 1,
        mimeType: 1,
        size: 1,
        sizes: 1,
        "created_by.name": 1,
        "created_by.family": 1,
        "created_by.phone_number": 1,
      };

      // Define populatable fields
      const populatableFields = [
        {
          path: "created_by",
          from: "files",
          localField: "created_by",
          foreignField: "_id",
        },
      ];

      // Build aggregation pipeline
      const { pipeline, pagination } = buildAggregationPipeline(
        queryOptions,
        searchableFields,
        selectFields,
        populatableFields
      );

      const files = await File.aggregate(pipeline);

      // Count total items
      const matchStage = pipeline.find((stage) => "$match" in stage) as
        | PipelineStage.Match
        | undefined;
      const totalItems = await File.countDocuments(matchStage?.$match || {});

      // Update pagination state
      pagination.links = generatePaginationLinks(
        totalItems,
        pagination.page,
        pagination.items_per_page
      );

      // Send response
      res.status(200).json(
        createResponse(files, {
          message: "Files retrieved successfully",
          pagination,
        })
      );
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Failed to fetch files." });
    }
  };

  // Get File by ID controller
  static getFileById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const fileId = req.params._id;
      const file = await File.findById(fileId);

      if (!file) {
        throw new CustomError("Invalid ID", 404, {
          id: ["Invalid ID"],
        });
      }
      // Send response
      res.status(200).json(
        createResponse(file, {
          message: "File retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  };

  // Delete file controller
  static deleteFile = async (req: Request, res: Response) => {
    try {
      const { _id } = req.params;

      const uploadDir = "uploads/";

      const file = await File.findById(_id);
      if (!file) {
        return res.status(404).json({ message: "File not found." });
      }
      // Delete files from disk
      fs.unlinkSync(path.join(__dirname, "../../../", file.sizes.small));
      fs.unlinkSync(path.join(__dirname, "../../../", file.sizes.medium));
      fs.unlinkSync(path.join(__dirname, "../../../", file.sizes.large));
      fs.unlinkSync(
        path.join(__dirname, "../../../", uploadDir, file.fileName)
      );

      // Delete from database
      await File.findByIdAndDelete(_id);

      res.status(200).json({ message: "File deleted successfully!" });
    } catch (error: any) {
      res
        .status(500)
        .json({ message: error.message || "Failed to delete file." });
    }
  };

  static getTotalFilesInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const stats = await File.aggregate([
        {
          $group: {
            _id: null,
            totalFiles: { $sum: 1 },
            totalSize: { $sum: "$size" },
          },
        },
      ]);

      res.status(200).json(
        createResponse(stats[0], {
          message: "Total files retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  };
}
