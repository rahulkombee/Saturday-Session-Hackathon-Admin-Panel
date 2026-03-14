import { z } from 'zod';
import { STATUS_VALUES } from '../constants/index.js';

export const userCreateSchema = z.object({
  firstname: z.string().trim().min(1, 'First name is required').max(100, 'First name cannot exceed 100 characters'),
  lastname: z.string().trim().min(1, 'Last name is required').max(100, 'Last name cannot exceed 100 characters'),
  email: z.string().trim().toLowerCase().email('Please provide a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.string().trim().min(1, 'Role is required'),
  status: z.enum(STATUS_VALUES),
});

export const userUpdateSchema = userCreateSchema.partial();

export type UserCreateSchemaOutput = z.output<typeof userCreateSchema>;
export type UserUpdateSchemaOutput = z.output<typeof userUpdateSchema>;
