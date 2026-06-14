import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

import { searchAndPaginationFields } from '@/shared/schemas/common.schema';
import { registerSchema as registerOpenAPISchema } from '@/shared/utils/openapi.util';

extendZodWithOpenApi(z);

// ==================== Query Schemas ====================

export const getReportersQuerySchema = registerOpenAPISchema(
  'GetReportersQuery',
  z
    .object({
      ...searchAndPaginationFields,
      sortBy: z.enum(['createdAt', 'updatedAt', 'name', 'city']).optional().default('createdAt').openapi({
        description: 'Field to sort by',
        example: 'createdAt',
      }),
      available: z
        .string()
        .optional()
        .transform((val) => {
          if (val === 'true') return true;
          if (val === 'false') return false;
          return undefined;
        })
        .openapi({
          description: 'Filter by availability status',
          example: 'true',
        }),
    })
    .openapi({
      description: 'Query parameters for retrieving reporters',
    })
);

// ==================== Reporter Management Schemas ====================

export const createReporterSchema = registerOpenAPISchema(
  'CreateReporterBody',
  z
    .object({
      name: z.string().min(2, 'Name must be at least 2 characters').max(100, 'Name must not exceed 100 characters').openapi({
        description: 'Reporter full name',
        example: 'Sarah Connor',
      }),
      city: z.string().min(1, 'City is required').max(100, 'City must not exceed 100 characters').openapi({
        description: 'City where the reporter is based',
        example: 'Jakarta',
      }),
      available: z.boolean().optional().default(true).openapi({
        description: 'Availability status',
        example: true,
      }),
      ratePerMin: z.number().int().positive('Rate must be greater than 0').optional().default(2000).openapi({
        description: 'Pay rate per minute in IDR',
        example: 2000,
      }),
    })
    .openapi({
      description: 'Reporter creation data',
    })
);

export const updateReporterSchema = registerOpenAPISchema(
  'UpdateReporterBody',
  z
    .object({
      name: z.string().min(2).max(100).optional().openapi({
        description: 'Reporter full name',
        example: 'Sarah Connor',
      }),
      city: z.string().min(1).max(100).optional().openapi({
        description: 'City where the reporter is based',
        example: 'Jakarta',
      }),
      available: z.boolean().optional().openapi({
        description: 'Availability status',
        example: false,
      }),
      ratePerMin: z.number().int().positive().optional().openapi({
        description: 'Pay rate per minute in IDR',
        example: 2500,
      }),
    })
    .openapi({
      description: 'Reporter update data',
    })
);

// ==================== Type Exports ====================

export type GetReportersQuery = z.infer<typeof getReportersQuerySchema>;
export type CreateReporterBody = z.infer<typeof createReporterSchema>;
export type UpdateReporterBody = z.infer<typeof updateReporterSchema>;