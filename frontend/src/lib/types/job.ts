export enum JobStatus {
  NEW = 'NEW',
  ASSIGNED = 'ASSIGNED',
  TRANSCRIBED = 'TRANSCRIBED',
  REVIEWED = 'REVIEWED',
  COMPLETED = 'COMPLETED',
}

export enum JobLocation {
  PHYSICAL = 'PHYSICAL',
  REMOTE = 'REMOTE',
}

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
  createdAt: string;
  updatedAt: string;
}

export interface PaymentBreakdownResponse {
  jobId: string;
  reporterPay: number;
  editorPay: number;
  total: number;
}

export interface GetJobsParams {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: 'createdAt' | 'updatedAt' | 'caseName' | 'duration';
  sortOrder?: 'asc' | 'desc';
  status?: JobStatus[];
  location?: JobLocation[];
}

export interface CreateJobRequest {
  caseName: string;
  duration: number;
  location: JobLocation;
  city?: string;
}

export interface UpdateJobStatusRequest {
  status: JobStatus;
}

export interface AssignReporterRequest {
  reporterId: string;
}

export interface AssignEditorRequest {
  editorId: string;
}

export const ALLOWED_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  [JobStatus.NEW]: [JobStatus.ASSIGNED],
  [JobStatus.ASSIGNED]: [JobStatus.TRANSCRIBED],
  [JobStatus.TRANSCRIBED]: [JobStatus.REVIEWED],
  [JobStatus.REVIEWED]: [JobStatus.COMPLETED],
  [JobStatus.COMPLETED]: [],
};