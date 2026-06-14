import { apiClient } from '../client/axios';
import type {
  CreateReporterRequest,
  GetReportersParams,
  ReporterResponse,
  UpdateReporterRequest,
} from '@/lib/types/reporter';
import type { SuccessResponse } from '@/lib/types/api';

export const reporterApi = {
  /**
   * Get paginated list of reporters
   */
  getReporters: async (params?: GetReportersParams): Promise<SuccessResponse<ReporterResponse[]>> => {
    const { data } = await apiClient.get<SuccessResponse<ReporterResponse[]>>('/reporters', { params });
    return data;
  },

  /**
   * Get reporter by ID
   */
  getReporterById: async (id: string): Promise<SuccessResponse<ReporterResponse>> => {
    const { data } = await apiClient.get<SuccessResponse<ReporterResponse>>(`/reporters/${id}`);
    return data;
  },

  /**
   * Create new reporter
   */
  createReporter: async (payload: CreateReporterRequest): Promise<SuccessResponse<ReporterResponse>> => {
    const { data } = await apiClient.post<SuccessResponse<ReporterResponse>>('/reporters', payload);
    return data;
  },

  /**
   * Update reporter by ID
   */
  updateReporter: async (id: string, payload: UpdateReporterRequest): Promise<SuccessResponse<ReporterResponse>> => {
    const { data } = await apiClient.patch<SuccessResponse<ReporterResponse>>(`/reporters/${id}`, payload);
    return data;
  },

  /**
   * Delete reporter by ID
   */
  deleteReporter: async (id: string): Promise<SuccessResponse<null>> => {
    const { data } = await apiClient.delete<SuccessResponse<null>>(`/reporters/${id}`);
    return data;
  },
};