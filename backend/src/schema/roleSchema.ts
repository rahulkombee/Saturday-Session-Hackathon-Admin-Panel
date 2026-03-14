import { z } from 'zod';
import { STATUS_VALUES } from '../constants/index.js';

export const roleCreateSchema = z.object({
  name: z.string().trim().min(1, 'Name is required').max(100, 'Name cannot exceed 100 characters'),
  status: z.enum(STATUS_VALUES),
});

export const roleUpdateSchema = roleCreateSchema.partial();

export type RoleCreateSchemaOutput = z.output<typeof roleCreateSchema>;
export type RoleUpdateSchemaOutput = z.output<typeof roleUpdateSchema>;
