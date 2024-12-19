import { NextFunction, Request, Response } from "express";
import { PipelineStage } from "mongoose";
import User, { IUser } from "../../models/User";
import { createResponse } from "../../helpers/Query/QueryResponse";
import { buildAggregationPipeline } from "../../helpers/Query/AggregationPipeline";
import { generatePaginationLinks } from "../../helpers/Query/GeneratePaginationLinks";
import { CustomError } from "../../helpers/CustomError";

const userController = class {
  // Create a new user
  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        family,
        username,
        phone_number,
        role,
        permissions,
        camp,
        pic,
      } = req.body as IUser;

      const user = await User.create({
        name,
        family,
        username,
        phone_number,
        role,
        permissions,
        camp,
        pic,
      });

      res.status(201).json(
        createResponse([user], {
          message: "User created successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  };

  // Retrieve a list of users
  static get = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { page, items_per_page, search, sort, order } = req.query;

      // Convert query params to the expected types
      const queryOptions = {
        page: Number(page) || 1,
        items_per_page: (Number(items_per_page) || 10) as 10 | 30 | 50 | 100,
        search: search as string,
        sort: sort as string,
        order: order as "asc" | "desc",
      };

      // Define searchable fields
      const searchableFields = ["name", "family", "phone_number"]; // Adjust fields based on your schema

      //   Define desire projec fiels

      const selectFields: Record<string, 0 | 1> = {
        name: 1,
        family: 1,
        phone_number: 1,
        role: 1,
        status: 1,
        deleted: 1,
      };

      // Build aggregation pipeline
      const { pipeline, pagination } = buildAggregationPipeline(
        queryOptions,
        searchableFields,
        selectFields
      );

      // Execute the aggregation pipeline
      const users = await User.aggregate(pipeline);

      // Count total items
      const matchStage = pipeline.find((stage) => "$match" in stage) as
        | PipelineStage.Match
        | undefined;
      const totalItems = await User.countDocuments(matchStage?.$match || {});

      // Update pagination state
      pagination.links = generatePaginationLinks(
        totalItems,
        pagination.page,
        pagination.items_per_page
      );

      // Send response
      res.status(200).json(
        createResponse(users, {
          message: "Users retrieved successfully",
          pagination,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  static getUserById = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.params._id;
      const user = await User.findById(userId);

      if (!user) {
        throw new CustomError("Invalid ID", 404, {
          id: ["Invalid ID"],
        });
      }
      // Send response
      res.status(200).json(
        createResponse(user, {
          message: "Users retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  };
  // Update an existing user
  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const updateData = req.body as Partial<IUser>;

      const updatedUser = await User.findByIdAndUpdate(id, updateData, {
        new: true,
      });

      if (!updatedUser) {
        return res.status(404).json(
          createResponse([], {
            message: "User not found",
          })
        );
      }

      res.status(200).json(
        createResponse([updatedUser], {
          message: "User updated successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  };

  // Delete a user
  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { _id } = req.params;

      const deletedUser = await User.updateOne(
        { _id },
        {
          $set: { deleted: true },
        }
      );
      if (!deletedUser) {
        throw new CustomError("Invalid ID", 404, {
          id: ["Invalid ID"],
        });
      }
      res.status(200).json(
        createResponse("", {
          message: "Users retrieved successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  };
};

export default userController;
