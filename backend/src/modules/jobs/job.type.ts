import { Job, JobLocation, JobStatus } from '@prisma/client';

export interface ReporterSummary {
  id: string;
  name: string;
  city: string;
  available: boolean;
  ratePerMin: number;
}

export interface EditorSummary {
  id: string;
  name: string;
  flatFee: number;
}

export interface JobResponse {
  id: string;
  caseName: string;
  duration: number;
  location: JobLocation;
  city: string | null;
  status: JobStatus;
  reporter: ReporterSummary | null;
  editor: EditorSummary | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentBreakdownResponse {
  jobId: string;
  reporterPay: number;
  editorPay: number;
  total: number;
}

export type JobWithRelations = Job & {
  reporter: ReporterSummary | null;
  editor: EditorSummary | null;
};