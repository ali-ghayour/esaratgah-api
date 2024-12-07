import { NextFunction, Request, Response } from "express";
import { PipelineStage } from "mongoose";
import User, { IUser } from "../../../models/User";
import { createResponse } from "../../../helpers/Query/QueryResponse";
import { buildAggregationPipeline } from "../../../helpers/Query/AggregationPipeline";
import { generatePaginationLinks } from "../../../helpers/Query/GeneratePaginationLinks";

const userController = class {
  // Create a new user
  static create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const {
        name,
        familly,
        username,
        phone_number,
        role,
        permissions,
        camp,
        pic,
      } = req.body as IUser;

      const user = await User.create({
        name,
        familly,
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
      const searchableFields = ["name", "familly", "phone_number"]; // Adjust fields based on your schema

      //   Define desire projec fiels

      const selectFields: Record<string, 0 | 1> = {
        name: 1,
        familly: 1,
        phone_number:1,
        role:1,
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
      const { id } = req.params;

      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json(
          createResponse([], {
            message: "User not found",
          })
        );
      }

      res.status(200).json(
        createResponse([deletedUser], {
          message: "User deleted successfully",
        })
      );
    } catch (error) {
      next(error);
    }
  };
};

export default userController;
