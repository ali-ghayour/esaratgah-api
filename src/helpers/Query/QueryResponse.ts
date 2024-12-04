// Define the UsersQueryResponse type
export type UsersQueryResponse<T> = {
  data?: T[] | undefined;
  payload?: {
    message?: string;
    errors?: {
      [key: string]: Array<string>;
    };
    pagination?: PaginationState;
  };
};

// Define PaginationState type
export type PaginationState = {
  page: number;
  items_per_page: 10 | 30 | 50 | 100;
  links?: Array<{
    label: string;
    active: boolean;
    url: string | null;
    page: number | null;
  }>;
};

// Response helper function
export const createResponse = <T>(
  data?: T[],
  options?: {
    message?: string;
    errors?: { [key: string]: Array<string> };
    pagination?: PaginationState;
    totalItems?: number;
  }
): {
  data?: T[];
  payload?: {
    message?: string;
    errors?: { [key: string]: Array<string> };
    pagination?: PaginationState;
    totalItems?: number;
  };
} => {
  const { message, errors, pagination, totalItems } = options || {};
  return {
    data,
    payload: {
      message,
      errors,
      pagination,
      totalItems,
    },
  };
};
