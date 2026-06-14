import { Prisma } from '@prisma/client';

import type { JobResponse, JobWithRelations } from './job.type';

export const JOB_BASE_SELECT = {
  id: true,
  caseName: true,
  duration: true,
  location: true,
  city: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  reporter: {
    select: {
      id: true,
      name: true,
      city: true,
      available: true,
      ratePerMin: true,
    },
  },
  editor: {
    select: {
      id: true,
      name: true,
      flatFee: true,
    },
  },
} satisfies Prisma.JobSelect;

export type JobWithSelect = Prisma.JobGetPayload<{ select: typeof JOB_BASE_SELECT }>;

export function mapJobResponse(job: JobWithSelect): JobResponse {
  return {
    id: job.id,
    caseName: job.caseName,
    duration: job.duration,
    location: job.location,
    city: job.city,
    status: job.status,
    reporter: job.reporter
      ? {
          id: job.reporter.id,
          name: job.reporter.name,
          city: job.reporter.city,
          available: job.reporter.available,
          ratePerMin: job.reporter.ratePerMin,
        }
      : null,
    editor: job.editor
      ? {
          id: job.editor.id,
          name: job.editor.name,
          flatFee: job.editor.flatFee,
        }
      : null,
    createdAt: job.createdAt,
    updatedAt: job.updatedAt,
  };
}

export function mapJobsResponse(jobs: JobWithSelect[]): JobResponse[] {
  return jobs.map(mapJobResponse);
}