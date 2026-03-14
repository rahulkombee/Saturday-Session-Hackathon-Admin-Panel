import { z } from 'zod';
import { STATUS_VALUES, DEFAULT_LIMIT, DEFAULT_PAGE, MAX_LIMIT } from '../constants/index.js';

export const listQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(DEFAULT_PAGE),
  limit: z.coerce.number().int().min(1).max(MAX_LIMIT).default(DEFAULT_LIMIT),
  name: z.string().trim().optional(),
  status: z.enum(STATUS_VALUES).optional(),
});

export type ListQuerySchemaOutput = z.output<typeof listQuerySchema>;
