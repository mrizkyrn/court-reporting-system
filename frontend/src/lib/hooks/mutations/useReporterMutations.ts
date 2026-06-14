import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { queryKeys } from '@/lib/api/queryKeys';
import { reporterApi } from '@/lib/api/services/reporterService';
import type { CreateReporterRequest, ReporterResponse, UpdateReporterRequest } from '@/lib/types/reporter';
import type { ErrorResponse, SuccessResponse } from '@/lib/types/api';
import { getErrorMessage, logError } from '@/lib/utils/errorHandler';

/**
 * Create new reporter
 */
export const useCreateReporter = () => {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse<ReporterResponse>, AxiosError<ErrorResponse>, CreateReporterRequest>({
    mutationFn: async (data: CreateReporterRequest): Promise<SuccessResponse<ReporterResponse>> => {
      return await reporterApi.createReporter(data);
    },
    onSuccess: (response) => {
      const { data, message } = response;
      queryClient.invalidateQueries({ queryKey: queryKeys.reporters.all });
      toast.success(message, { description: `Reporter ${data.name} has been added` });
    },
    onError: (error) => {
      logError('Create Reporter', error);
      const errorMessage = getErrorMessage(error, 'Failed to create reporter');
      toast.error('Reporter creation failed', { description: errorMessage });
    },
    retry: false,
  });
};

/**
 * Update reporter by ID
 */
export const useUpdateReporter = () => {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse<ReporterResponse>, AxiosError<ErrorResponse>, { id: string; data: UpdateReporterRequest }>(
    {
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: UpdateReporterRequest;
      }): Promise<SuccessResponse<ReporterResponse>> => {
        return await reporterApi.updateReporter(id, data);
      },
      onSuccess: (response, variables) => {
        const { data, message } = response;
        queryClient.invalidateQueries({ queryKey: queryKeys.reporters.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.reporters.lists() });
        toast.success(message, { description: `Reporter ${data.name} has been updated` });
      },
      onError: (error) => {
        logError('Update Reporter', error);
        const errorMessage = getErrorMessage(error, 'Failed to update reporter');
        toast.error('Reporter update failed', { description: errorMessage });
      },
      retry: false,
    }
  );
};

/**
 * Delete reporter by ID
 */
export const useDeleteReporter = () => {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: async (id: string): Promise<SuccessResponse<null>> => {
      return await reporterApi.deleteReporter(id);
    },
    onSuccess: (response) => {
      const { message } = response;
      queryClient.invalidateQueries({ queryKey: queryKeys.reporters.all });
      toast.success(message, { description: 'Reporter has been removed' });
    },
    onError: (error) => {
      logError('Delete Reporter', error);
      const errorMessage = getErrorMessage(error, 'Failed to delete reporter');
      toast.error('Reporter deletion failed', { description: errorMessage });
    },
    retry: false,
  });
};