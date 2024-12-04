import { PipelineStage } from "mongoose";
import { PaginationState } from "./QueryResponse";

/**
 * Builds an aggregation pipeline for MongoDB queries.
 * Includes pagination, sorting, and search functionality.
 * @param options - The query options from the client.
 * @param searchableFields - The fields to include in the dynamic search condition.
 * @returns An array of pipeline stages for MongoDB aggregation and pagination state.
 */
export function buildAggregationPipeline<T>(
  {
    page,
    items_per_page,
    search,
    sort,
    order,
  }: {
    page?: number;
    items_per_page?: 10 | 30 | 50 | 100;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
  },
  searchableFields: string[] = []
): { pipeline: PipelineStage[]; pagination: PaginationState } {
  const pipeline: PipelineStage[] = [];

  // Defaults
  const currentPage = page || 1;
  const perPage = items_per_page || 10;

  // Build dynamic $or condition for search
  if (search && searchableFields.length > 0) {
    const dynamicOrCondition = searchableFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));
    pipeline.push({ $match: { $or: dynamicOrCondition } });
  }

  // Add sorting stage
  if (sort) {
    const sortOrder = order === "asc" ? 1 : -1;
    pipeline.push({ $sort: { [sort]: sortOrder } });
  }

  // Add pagination stages
  const skip = (currentPage - 1) * perPage;
  pipeline.push({ $skip: skip });
  pipeline.push({ $limit: perPage });

  // Construct pagination state
  const pagination: PaginationState = {
    page: currentPage,
    items_per_page: perPage,
  };

  return { pipeline, pagination };
}
