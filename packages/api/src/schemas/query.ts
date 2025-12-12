import { z } from 'zod';

export const PaginationInput = z.object({
  page: z.number().int().positive().default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
});

export const SearchInput = z.object({
  query: z.string().min(1),
  limit: z.number().int().min(1).max(100).default(10),
});
