import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/api/queryKeys';
import { jobApi } from '@/lib/api/services/jobService';
import type { GetJobsParams } from '@/lib/types/job';

/**
 * Get paginated list of jobs
 */
export const useJobs = (params?: GetJobsParams) => {
  return useQuery({
    queryKey: queryKeys.jobs.list(params as Record<string, unknown>),
    queryFn: () => jobApi.getJobs(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Get job by ID
 */
export const useJob = (id: string) => {
  return useQuery({
    queryKey: queryKeys.jobs.detail(id),
    queryFn: () => jobApi.getJobById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Get payment breakdown for a job
 */
export const useJobPayment = (id: string) => {
  return useQuery({
    queryKey: queryKeys.jobs.payment(id),
    queryFn: () => jobApi.getPayment(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Get suggested reporters for a job
 */
export const useSuggestedReporters = (id: string) => {
  return useQuery({
    queryKey: queryKeys.jobs.suggestedReporters(id),
    queryFn: () => jobApi.getSuggestedReporters(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};