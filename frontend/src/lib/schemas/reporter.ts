import { z } from 'zod';

export const getReportersQuerySchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
  available: z.boolean().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'city']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const createReporterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
  city: z.string().min(1, 'City is required').max(100, 'City must not exceed 100 characters'),
  available: z.boolean().default(true),
  ratePerMin: z.coerce.number().int().positive('Rate must be greater than 0').default(2000),
});

export const updateReporterSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  city: z.string().min(1).max(100).optional(),
  available: z.boolean().optional(),
  ratePerMin: z.number().int().positive().optional(),
});

export type GetReportersQuery = z.infer<typeof getReportersQuerySchema>;
export type CreateReporterInput = z.infer<typeof createReporterSchema>;
export type UpdateReporterInput = z.infer<typeof updateReporterSchema>;