import { z } from 'zod';

export const userSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  createdAt: z.date(),
  preferences: z.object({
    categories: z.array(z.string()).min(1, 'At least one category is required'),
    reviewFrequency: z.enum(['weekly', 'monthly', 'quarterly']),
  }),
});

export type UserInput = z.infer<typeof userSchema>;