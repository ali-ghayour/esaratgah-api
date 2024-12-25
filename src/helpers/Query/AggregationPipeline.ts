import { PipelineStage } from "mongoose";
import { PaginationState } from "./QueryResponse";

/**
 * Builds an aggregation pipeline for MongoDB queries.
 * Includes pagination, sorting, search functionality, field selection, and population.
 * @param options - The query options from the client.
 * @param searchableFields - The fields to include in the dynamic search condition.
 * @param selectFields - Optional: Fields to include or exclude in the projection stage.
 * @param populatableFields - Optional: Fields to populate using $lookup in the aggregation pipeline.
 * @returns An object containing the pipeline stages and pagination state.
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
  searchableFields: string[] = [],
  selectFields?: Record<string, 1 | 0>,
  populatableFields?: { path: string; from: string; foreignField: string; localField: string }[]
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
  pipeline.push({ $skip: skip }, { $limit: perPage });

  // Optional select (project) stage
  if (selectFields && Object.keys(selectFields).length > 0) {
    pipeline.push({ $project: selectFields });
  }

  // Add $lookup stages for populatable fields
  if (populatableFields && populatableFields.length > 0) {
    for (const field of populatableFields) {
      pipeline.push({
        $lookup: {
          from: field.from, // The target collection to join
          localField: field.localField, // The field in the current collection
          foreignField: field.foreignField, // The field in the target collection
          as: field.path, // The resulting array field name
        },
      });

      // Optionally, replace array with a single object (first match)
      pipeline.push({
        $unwind: {
          path: `$${field.path}`,
          preserveNullAndEmptyArrays: true, // Keeps the field even if there's no match
        },
      });
    }
  }

  // Construct pagination state
  const pagination: PaginationState = {
    page: currentPage,
    items_per_page: perPage,
  };

  return { pipeline, pagination };
}
