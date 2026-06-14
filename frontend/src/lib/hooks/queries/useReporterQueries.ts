import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/api/queryKeys';
import { reporterApi } from '@/lib/api/services/reporterService';
import type { GetReportersParams } from '@/lib/types/reporter';

/**
 * Get paginated list of reporters
 */
export const useReporters = (params?: GetReportersParams) => {
  return useQuery({
    queryKey: queryKeys.reporters.list(params as Record<string, unknown>),
    queryFn: () => reporterApi.getReporters(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Get reporter by ID
 */
export const useReporter = (id: string) => {
  return useQuery({
    queryKey: queryKeys.reporters.detail(id),
    queryFn: () => reporterApi.getReporterById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};