import { z } from 'zod';

import { JobLocation, JobStatus } from '../types/job';

export const getJobsQuerySchema = z.object({
  page: z.number().int().positive().optional().default(1),
  limit: z.number().int().positive().max(100).optional().default(10),
  search: z.string().optional(),
  status: z.array(z.nativeEnum(JobStatus)).optional(),
  location: z.array(z.nativeEnum(JobLocation)).optional(),
  sortBy: z.enum(['createdAt', 'updatedAt', 'caseName', 'duration']).optional().default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export const createJobSchema = z
  .object({
    caseName: z.string().min(2, 'Case name must be at least 2 characters').max(150, 'Case name must not exceed 150 characters'),
    duration: z
      .number({ message: 'Duration is required' })
      .int('Duration must be a whole number')
      .positive('Duration must be greater than 0'),
    location: z.nativeEnum(JobLocation),
    city: z.string().optional(),
  })
  .refine((data) => data.location !== JobLocation.PHYSICAL || !!data.city?.trim(), {
    message: 'City is required for physical jobs',
    path: ['city'],
  });

export const updateJobStatusSchema = z.object({
  status: z.nativeEnum(JobStatus),
});

export const assignReporterSchema = z.object({
  reporterId: z.string().min(1, 'Please select a reporter'),
});

export const assignEditorSchema = z.object({
  editorId: z.string().min(1, 'Please select an editor'),
});

export type GetJobsQuery = z.infer<typeof getJobsQuerySchema>;
export type CreateJobInput = z.infer<typeof createJobSchema>;
export type UpdateJobStatusInput = z.infer<typeof updateJobStatusSchema>;
export type AssignReporterInput = z.infer<typeof assignReporterSchema>;
export type AssignEditorInput = z.infer<typeof assignEditorSchema>;