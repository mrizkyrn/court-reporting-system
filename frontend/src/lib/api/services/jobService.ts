import { apiClient } from '../client/axios';
import type {
  AssignEditorRequest,
  AssignReporterRequest,
  CreateJobRequest,
  GetJobsParams,
  JobResponse,
  PaymentBreakdownResponse,
  ReporterSummary,
  UpdateJobStatusRequest,
} from '@/lib/types/job';
import type { SuccessResponse } from '@/lib/types/api';

export const jobApi = {
  /**
   * Get paginated list of jobs
   */
  getJobs: async (params?: GetJobsParams): Promise<SuccessResponse<JobResponse[]>> => {
    const { data } = await apiClient.get<SuccessResponse<JobResponse[]>>('/jobs', {
      params: {
        ...params,
        status: params?.status?.join(','),
        location: params?.location?.join(','),
      },
    });
    return data;
  },

  /**
   * Get job by ID
   */
  getJobById: async (id: string): Promise<SuccessResponse<JobResponse>> => {
    const { data } = await apiClient.get<SuccessResponse<JobResponse>>(`/jobs/${id}`);
    return data;
  },

  /**
   * Create new job
   */
  createJob: async (payload: CreateJobRequest): Promise<SuccessResponse<JobResponse>> => {
    const { data } = await apiClient.post<SuccessResponse<JobResponse>>('/jobs', payload);
    return data;
  },

  /**
   * Update job status
   */
  updateStatus: async (id: string, payload: UpdateJobStatusRequest): Promise<SuccessResponse<JobResponse>> => {
    const { data } = await apiClient.patch<SuccessResponse<JobResponse>>(`/jobs/${id}/status`, payload);
    return data;
  },

  /**
   * Get suggested reporters for a job
   */
  getSuggestedReporters: async (id: string): Promise<SuccessResponse<ReporterSummary[]>> => {
    const { data } = await apiClient.get<SuccessResponse<ReporterSummary[]>>(`/jobs/${id}/suggested-reporters`);
    return data;
  },

  /**
   * Assign reporter to job
   */
  assignReporter: async (id: string, payload: AssignReporterRequest): Promise<SuccessResponse<JobResponse>> => {
    const { data } = await apiClient.patch<SuccessResponse<JobResponse>>(`/jobs/${id}/assign-reporter`, payload);
    return data;
  },

  /**
   * Assign editor to job
   */
  assignEditor: async (id: string, payload: AssignEditorRequest): Promise<SuccessResponse<JobResponse>> => {
    const { data } = await apiClient.patch<SuccessResponse<JobResponse>>(`/jobs/${id}/assign-editor`, payload);
    return data;
  },

  /**
   * Calculate payment breakdown for a job
   */
  getPayment: async (id: string): Promise<SuccessResponse<PaymentBreakdownResponse>> => {
    const { data } = await apiClient.get<SuccessResponse<PaymentBreakdownResponse>>(`/jobs/${id}/payment`);
    return data;
  },
};