import { Prisma } from '@prisma/client';

import type { ReporterResponse } from './reporter.type';

export const REPORTER_BASE_SELECT = {
  id: true,
  name: true,
  city: true,
  available: true,
  ratePerMin: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ReporterSelect;

export type ReporterWithSelect = Prisma.ReporterGetPayload<{ select: typeof REPORTER_BASE_SELECT }>;

export function mapReporterResponse(reporter: ReporterWithSelect): ReporterResponse {
  return {
    id: reporter.id,
    name: reporter.name,
    city: reporter.city,
    available: reporter.available,
    ratePerMin: reporter.ratePerMin,
    createdAt: reporter.createdAt,
    updatedAt: reporter.updatedAt,
  };
}

export function mapReportersResponse(reporters: ReporterWithSelect[]): ReporterResponse[] {
  return reporters.map(mapReporterResponse);
}