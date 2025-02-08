import { PipelineStage } from "mongoose";
import { PaginationState } from "./QueryResponse";

/**
 * Builds an aggregation pipeline for MongoDB queries.
 * Includes filtering, pagination, sorting, search functionality, field selection, and population.
 * @param options - The query options from the client.
 * @param searchableFields - The fields to include in the dynamic search condition.
 * @param selectFields - Optional: Fields to include or exclude in the projection stage (supports nested fields).
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
    ...filters
  }: {
    page?: number;
    items_per_page?: 10 | 30 | 50 | 100;
    search?: string;
    sort?: string;
    order?: "asc" | "desc";
    [key: string]: any; // Include other dynamic query fields like `filter_*`
  },
  searchableFields: string[] = [],
  selectFields?: Record<string, 1 | 0>,
  populatableFields?: {
    path: string;
    from: string;
    foreignField: string;
    localField: string;
  }[]
): { pipeline: PipelineStage[]; pagination: PaginationState } {
  const pipeline: PipelineStage[] = [];

  // Defaults
  const currentPage = page || 1;
  const perPage = items_per_page || 10;

  // Build $match stage for filters
  const matchStage: Record<string, any> = {};

  Object.entries(filters).forEach(([key, value]) => {
    if (key.startsWith("filter_")) {
      const fieldName = key.replace("filter_", ""); // Extract field name from `filter_`
      let filterValue = value;

      // Convert value to the appropriate type
      if (!isNaN(Number(value))) {
        filterValue = Number(value); // Convert numeric strings to numbers
      } else if (value === "true" || value === "false") {
        filterValue = value === "true"; // Convert boolean strings to boolean
      }

      matchStage[fieldName] = filterValue;
    }
  });

  // Add dynamic search condition
  if (search && searchableFields.length > 0) {
    const dynamicOrCondition = searchableFields.map((field) => ({
      [field]: { $regex: search, $options: "i" },
    }));

    matchStage.$or = dynamicOrCondition;
  }

  // Add match stage to the pipeline
  if (Object.keys(matchStage).length > 0) {
    pipeline.push({ $match: matchStage });
  }

  // Add sorting stage
  if (sort) {
    const sortOrder = order === "asc" ? 1 : -1;
    const formattedSort = sort === "createdat" ? "createdAt" : sort;
    pipeline.push({ $sort: { [formattedSort]: sortOrder } });
  }

  // Add pagination stages
  const skip = (currentPage - 1) * perPage;
  pipeline.push({ $skip: skip }, { $limit: perPage });

  // Add $lookup stages for populatable fields
  if (populatableFields && populatableFields.length > 0) {
    for (const field of populatableFields) {
      pipeline.push({
        $lookup: {
          from: field.from,
          localField: field.localField,
          foreignField: field.foreignField,
          as: field.path,
        },
      });

      pipeline.push({
        $unwind: {
          path: `$${field.path}`,
          preserveNullAndEmptyArrays: true,
        },
      });
    }
  }

  // Add $project stage for field selection
  if (selectFields && Object.keys(selectFields).length > 0) {
    const projection: Record<string, any> = {};

    Object.entries(selectFields).forEach(([key, value]) => {
      if (key.includes(".")) {
        // Handle nested fields
        const keys = key.split(".");
        let current = projection;

        keys.forEach((k, index) => {
          if (!current[k]) {
            current[k] = index === keys.length - 1 ? value : {};
          }
          current = current[k];
        });
      } else {
        projection[key] = value;
      }
    });

    pipeline.push({ $project: projection });
  }

  // Construct pagination state
  const pagination: PaginationState = {
    page: currentPage,
    items_per_page: perPage,
  };

  return { pipeline, pagination };
}
