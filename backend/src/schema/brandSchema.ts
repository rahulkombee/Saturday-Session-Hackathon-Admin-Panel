import { z } from 'zod';
import { STATUS_VALUES } from '../constants/index.js';

export const brandCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(200, 'Name cannot exceed 200 characters'),
  status: z.enum(STATUS_VALUES),
  description: z.string().trim().max(1000).optional(),
});

export const brandUpdateSchema = brandCreateSchema.partial();

export type BrandCreateSchemaOutput = z.output<typeof brandCreateSchema>;
export type BrandUpdateSchemaOutput = z.output<typeof brandUpdateSchema>;
