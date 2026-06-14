import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { searchAndPaginationFields } from '@/shared/schemas/common.schema';
import { registerSchema as registerOpenAPISchema } from '@/shared/utils/openapi.util';

extendZodWithOpenApi(z);

// ==================== Query Schemas ====================

export const getEditorsQuerySchema = registerOpenAPISchema(
  'GetEditorsQuery',
  z
    .object({
      ...searchAndPaginationFields,
      sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'flatFee']).optional().default('createdAt').openapi({
        description: 'Field to sort by',
        example: 'createdAt',
      }),
    })
    .openapi({
      description: 'Query parameters for retrieving editors',
    })
);

// ==================== Editor Management Schemas ====================

export const createEditorSchema = registerOpenAPISchema(
  'CreateEditorBody',
  z
    .object({
      name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters').openapi({
        description: 'Editor full name',
        example: 'John Editor',
      }),
      flatFee: z.number().int().positive('Flat fee must be greater than 0').optional().default(50000).openapi({
        description: 'Flat fee paid per job in IDR',
        example: 50000,
      }),
    })
    .openapi({
      description: 'Editor creation data',
    })
);

export const updateEditorSchema = registerOpenAPISchema(
  'UpdateEditorBody',
  z
    .object({
      name: z.string().min(2).max(100).optional().openapi({
        description: 'Editor full name',
        example: 'John Editor',
      }),
      flatFee: z.number().int().positive().optional().openapi({
        description: 'Flat fee paid per job in IDR',
        example: 60000,
      }),
    })
    .openapi({
      description: 'Editor update data',
    })
);

// ==================== Type Exports ====================

export type GetEditorsQuery = z.infer<typeof getEditorsQuerySchema>;
export type CreateEditorBody = z.infer<typeof createEditorSchema>;
export type UpdateEditorBody = z.infer<typeof updateEditorSchema>;