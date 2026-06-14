import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { JobLocation, JobStatus } from '@prisma/client';
import { z } from 'zod';

import { arrayField, searchAndPaginationFields } from '@/shared/schemas/common.schema';
import { registerSchema as registerOpenAPISchema } from '@/shared/utils/openapi.util';

extendZodWithOpenApi(z);

// ==================== Query Schemas ====================

export const getJobsQuerySchema = registerOpenAPISchema(
  'GetJobsQuery',
  z
    .object({
      ...searchAndPaginationFields,
      sortBy: z.enum(['createdAt', 'updatedAt', 'caseName', 'duration']).optional().default('createdAt').openapi({
        description: 'Field to sort by',
        example: 'createdAt',
      }),
      status: arrayField(z.enum(JobStatus)).openapi({
        description: 'Filter by job status (comma-separated for multiple)',
        example: 'NEW,ASSIGNED',
      }),
      location: arrayField(z.enum(JobLocation)).openapi({
        description: 'Filter by job location type',
        example: 'PHYSICAL,REMOTE',
      }),
    })
    .openapi({
      description: 'Query parameters for retrieving jobs',
    })
);

// ==================== Job Management Schemas ====================

export const createJobSchema = registerOpenAPISchema(
  'CreateJobBody',
  z
    .object({
      caseName: z.string().min(2, 'Case name must be at least 2 characters').max(150, 'Case name must not exceed 150 characters').openapi({
        description: 'Name of the court case',
        example: 'State v. Johnson',
      }),
      duration: z.number().int().positive('Duration must be greater than 0').openapi({
        description: 'Estimated duration in minutes',
        example: 120,
      }),
      location: z.enum(JobLocation).openapi({
        description: 'Job location type',
        example: JobLocation.PHYSICAL,
      }),
      city: z.string().min(1).optional().openapi({
        description: 'City where the job takes place (required for PHYSICAL jobs)',
        example: 'Jakarta',
      }),
    })
    .refine((data) => data.location !== JobLocation.PHYSICAL || !!data.city, {
      message: 'City is required for physical jobs',
      path: ['city'],
    })
    .openapi({
      description: 'Job creation data',
    })
);

export const updateJobStatusSchema = registerOpenAPISchema(
  'UpdateJobStatusBody',
  z
    .object({
      status: z.enum(JobStatus).openapi({
        description: 'New status to transition the job to',
        example: JobStatus.ASSIGNED,
      }),
    })
    .openapi({
      description: 'Job status update data',
    })
);

export const assignReporterSchema = registerOpenAPISchema(
  'AssignReporterBody',
  z
    .object({
      reporterId: z.cuid('Invalid reporter ID format').openapi({
        description: 'ID of the reporter to assign',
        example: 'clxxx1234567890',
      }),
    })
    .openapi({
      description: 'Reporter assignment data',
    })
);

export const assignEditorSchema = registerOpenAPISchema(
  'AssignEditorBody',
  z
    .object({
      editorId: z.cuid('Invalid editor ID format').openapi({
        description: 'ID of the editor to assign',
        example: 'clxxx1234567890',
      }),
    })
    .openapi({
      description: 'Editor assignment data',
    })
);

// ==================== Type Exports ====================

export type GetJobsQuery = z.infer<typeof getJobsQuerySchema>;
export type CreateJobBody = z.infer<typeof createJobSchema>;
export type UpdateJobStatusBody = z.infer<typeof updateJobStatusSchema>;
export type AssignReporterBody = z.infer<typeof assignReporterSchema>;
export type AssignEditorBody = z.infer<typeof assignEditorSchema>;