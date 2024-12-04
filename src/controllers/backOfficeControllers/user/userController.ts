import { NextFunction, Request, Response } from "express";
import { PipelineStage } from "mongoose";
import User, { IUser } from "../../../models/User";
import { createResponse } from "../../../helpers/Query/QueryResponse";
import { buildAggregationPipeline } from "../../../helpers/Query/AggregationPipeline";
import { generatePaginationLinks } from "../../../helpers/Query/GeneratePaginationLinks";

const userController = class {
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

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  };

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
      const searchableFields = ["name", "familly", "description"]; // Adjust fields based on your schema

      // Build aggregation pipeline
      const { pipeline, pagination } = buildAggregationPipeline(
        queryOptions,
        searchableFields
      );

      // Execute the pipeline
      const users = await User.aggregate(pipeline);

      // Count total items
      const matchStage = pipeline.find((stage) => "$match" in stage) as
        | PipelineStage.Match
        | undefined;
      const totalItems = await User.countDocuments(matchStage?.$match || {});

      // Update pagination with total items and links
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
          totalItems,
        })
      );
    } catch (error) {
      next(error);
    }
  };

  static update = async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      next(error);
    }
  };

  static delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
    } catch (error) {
      next(error);
    }
  };
};

export default userController;
