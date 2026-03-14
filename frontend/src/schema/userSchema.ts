import { z } from 'zod';

export const userCreateSchema = z.object({
  firstname: z.string().min(1, 'First name is required').max(100),
  lastname: z.string().min(1, 'Last name is required').max(100),
  email: z.string().min(1, 'Email is required').email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().min(1, 'Role is required'),
  status: z.enum(['Y', 'N']),
});

export const userUpdateSchema = z.object({
  firstname: z.string().min(1).max(100).optional(),
  lastname: z.string().min(1).max(100).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).optional().or(z.literal('')),
  role: z.string().min(1).optional(),
  status: z.enum(['Y', 'N']).optional(),
});

export type UserCreateSchema = z.infer<typeof userCreateSchema>;
export type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
