import { z } from 'zod';

export const brandCreateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  status: z.enum(['Y', 'N']),
  description: z.string().max(1000).optional(),
});

export const brandUpdateSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  status: z.enum(['Y', 'N']).optional(),
  description: z.string().max(1000).optional(),
});

export type BrandCreateSchema = z.infer<typeof brandCreateSchema>;
export type BrandUpdateSchema = z.infer<typeof brandUpdateSchema>;
