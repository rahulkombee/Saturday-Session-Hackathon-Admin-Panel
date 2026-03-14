import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Please provide a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginSchemaInput = z.input<typeof loginSchema>;
export type LoginSchemaOutput = z.output<typeof loginSchema>;
