import { z } from 'zod';

export const getEditorsQuerySchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'flatFee']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const createEditorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters'),
  flatFee: z.coerce.number().int().positive('Flat fee must be greater than 0').default(50000),
});

export const updateEditorSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  flatFee: z.number().int().positive().optional(),
});

export type GetEditorsQuery = z.infer<typeof getEditorsQuerySchema>;
export type CreateEditorInput = z.infer<typeof createEditorSchema>;
export type UpdateEditorInput = z.infer<typeof updateEditorSchema>;