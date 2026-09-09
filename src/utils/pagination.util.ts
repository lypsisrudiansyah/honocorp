export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Translates query parameter page and limit into MySQL limit and offset operations.
 */
export const parsePagination = (
  query: { page?: string | number | undefined; limit?: string | number | undefined },
  defaultLimit: number = 10,
  maxLimit: number = 100
): PaginationParams => {
  const rawPage = query.page !== undefined ? Number(query.page) : 1;
  const rawLimit = query.limit !== undefined ? Number(query.limit) : defaultLimit;

  const page = Number.isInteger(rawPage) && rawPage > 0 ? rawPage : 1;
  const parsedLimit = Number.isInteger(rawLimit) && rawLimit > 0 ? rawLimit : defaultLimit;
  const limit = Math.min(parsedLimit, maxLimit);
  const offset = (page - 1) * limit;

  return {
    page,
    limit,
    offset,
  };
};

/**
 * Generates standard pagination metadata for API responses.
 */
export const createPaginationMeta = (
  totalItems: number,
  page: number,
  limit: number
): PaginationMeta => {
  const totalPages = Math.max(1, Math.ceil(totalItems / limit));

  return {
    page,
    limit,
    totalItems,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};
