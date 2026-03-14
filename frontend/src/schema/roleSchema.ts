import { z } from 'zod';

export const roleCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  status: z.enum(['Y', 'N']),
});

export const roleUpdateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  status: z.enum(['Y', 'N']).optional(),
});

export type RoleCreateSchema = z.infer<typeof roleCreateSchema>;
export type RoleUpdateSchema = z.infer<typeof roleUpdateSchema>;
