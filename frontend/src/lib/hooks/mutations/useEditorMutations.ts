import { useMutation, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { toast } from 'sonner';

import { queryKeys } from '@/lib/api/queryKeys';
import { editorApi } from '@/lib/api/services/editorService';
import type { CreateEditorRequest, EditorResponse, UpdateEditorRequest } from '@/lib/types/editor';
import type { ErrorResponse, SuccessResponse } from '@/lib/types/api';
import { getErrorMessage, logError } from '@/lib/utils/errorHandler';

/**
 * Create new editor
 */
export const useCreateEditor = () => {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse<EditorResponse>, AxiosError<ErrorResponse>, CreateEditorRequest>({
    mutationFn: async (data: CreateEditorRequest): Promise<SuccessResponse<EditorResponse>> => {
      return await editorApi.createEditor(data);
    },
    onSuccess: (response) => {
      const { data, message } = response;
      queryClient.invalidateQueries({ queryKey: queryKeys.editors.all });
      toast.success(message, { description: `Editor ${data.name} has been added` });
    },
    onError: (error) => {
      logError('Create Editor', error);
      const errorMessage = getErrorMessage(error, 'Failed to create editor');
      toast.error('Editor creation failed', { description: errorMessage });
    },
    retry: false,
  });
};

/**
 * Update editor by ID
 */
export const useUpdateEditor = () => {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse<EditorResponse>, AxiosError<ErrorResponse>, { id: string; data: UpdateEditorRequest }>(
    {
      mutationFn: async ({
        id,
        data,
      }: {
        id: string;
        data: UpdateEditorRequest;
      }): Promise<SuccessResponse<EditorResponse>> => {
        return await editorApi.updateEditor(id, data);
      },
      onSuccess: (response, variables) => {
        const { data, message } = response;
        queryClient.invalidateQueries({ queryKey: queryKeys.editors.detail(variables.id) });
        queryClient.invalidateQueries({ queryKey: queryKeys.editors.lists() });
        toast.success(message, { description: `Editor ${data.name} has been updated` });
      },
      onError: (error) => {
        logError('Update Editor', error);
        const errorMessage = getErrorMessage(error, 'Failed to update editor');
        toast.error('Editor update failed', { description: errorMessage });
      },
      retry: false,
    }
  );
};

/**
 * Delete editor by ID
 */
export const useDeleteEditor = () => {
  const queryClient = useQueryClient();

  return useMutation<SuccessResponse<null>, AxiosError<ErrorResponse>, string>({
    mutationFn: async (id: string): Promise<SuccessResponse<null>> => {
      return await editorApi.deleteEditor(id);
    },
    onSuccess: (response) => {
      const { message } = response;
      queryClient.invalidateQueries({ queryKey: queryKeys.editors.all });
      toast.success(message, { description: 'Editor has been removed' });
    },
    onError: (error) => {
      logError('Delete Editor', error);
      const errorMessage = getErrorMessage(error, 'Failed to delete editor');
      toast.error('Editor deletion failed', { description: errorMessage });
    },
    retry: false,
  });
};