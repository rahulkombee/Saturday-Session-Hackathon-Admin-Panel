import type { PaginationMeta } from '../types/index.js';

export function buildPagination(
  page: number,
  limit: number,
  total: number
): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = total === 0 ? 0 : Math.min(page * limit, total);
  return {
    from,
    to,
    total,
    page,
    limit,
    totalPages,
  };
}
