import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { queryKeys } from '@/lib/api/queryKeys';
import { jobApi } from '@/lib/api/services/jobService';
import type {
  AssignEditorRequest,
  AssignReporterRequest,
  CreateJobRequest,
  JobResponse,
  PaymentBreakdownResponse,
  UpdateJobStatusRequest,
} from '@/lib/types/job';
import type { ErrorResponse, SuccessResponse } from '@/lib/types/api';
import { getErrorMessage, logError } from '@/lib/utils/errorHandler';

/**
 * Create new job
 */
export const useCreateJob = () => {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse<JobResponse>, AxiosError<ErrorResponse>, CreateJobRequest>({
    mutationFn: async (data: CreateJobRequest): Promise<SuccessResponse<JobResponse>> => {
      return await jobApi.createJob(data);
    },
    onSuccess: (response) => {
      const { data, message } = response;
      queryClient.invalidateQueries({ queryKey: queryKeys.jobs.all });
      toast.success(message, { description: `Job "${data.caseName}" has been created` });
    },
    onError: (error) => {
      logError('Create Job', error);
      const errorMessage = getErrorMessage(error, 'Failed to create job');
      toast.error('Job creation failed', { description: errorMessage });
    },
    retry: false,
  });
};

/**
 * Update job status
 */
export const useUpdateJobStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse<JobResponse>, AxiosError<ErrorResponse>, { id: string; data: UpdateJobStatusRequest }>(
    {
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: UpdateJobStatusRequest;
      }): Promise<SuccessResponse<JobResponse>> => {
        return await jobApi.updateStatus(id, data);
      },
      onSuccess: (response, variables) => {
        const { data, message } = response;
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
        toast.success(message, { description: `Job "${data.caseName}" is now ${data.status}` });
      },
      onError: (error) => {
        logError('Update Job Status', error);
        const errorMessage = getErrorMessage(error, 'Failed to update job status');
        toast.error('Status update failed', { description: errorMessage });
      },
      retry: false,
    }
  );
};

/**
 * Assign reporter to job
 */
export const useAssignReporter = () => {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse<JobResponse>, AxiosError<ErrorResponse>, { id: string; data: AssignReporterRequest }>(
    {
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: AssignReporterRequest;
      }): Promise<SuccessResponse<JobResponse>> => {
        return await jobApi.assignReporter(id, data);
      },
      onSuccess: (response, variables) => {
        const { data, message } = response;
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
        toast.success(message, { description: `Reporter ${data.reporter?.name ?? ''} assigned to "${data.caseName}"` });
      },
      onError: (error) => {
        logError('Assign Reporter', error);
        const errorMessage = getErrorMessage(error, 'Failed to assign reporter');
        toast.error('Reporter assignment failed', { description: errorMessage });
      },
      retry: false,
    }
  );
};

/**
 * Assign editor to job
 */
export const useAssignEditor = () => {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse<JobResponse>, AxiosError<ErrorResponse>, { id: string; data: AssignEditorRequest }>(
    {
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: AssignEditorRequest;
      }): Promise<SuccessResponse<JobResponse>> => {
        return await jobApi.assignEditor(id, data);
      },
      onSuccess: (response, variables) => {
        const { data, message } = response;
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.lists() });
        queryClient.invalidateQueries({ queryKey: queryKeys.jobs.payment(variables.id) });
        toast.success(message, { description: `Editor ${data.editor?.name ?? ''} assigned to "${data.caseName}"` });
      },
      onError: (error) => {
        logError('Assign Editor', error);
        const errorMessage = getErrorMessage(error, 'Failed to assign editor');
        toast.error('Editor assignment failed', { description: errorMessage });
      },
      retry: false,
    }
  );
};