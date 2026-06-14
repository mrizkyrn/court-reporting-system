import { apiClient } from '../client/axios';
import type { CreateEditorRequest, EditorResponse, GetEditorsParams, UpdateEditorRequest } from '@/lib/types/editor';
import type { SuccessResponse } from '@/lib/types/api';

export const editorApi = {
  /**
   * Get paginated list of editors
   */
  getEditors: async (params?: GetEditorsParams): Promise<SuccessResponse<EditorResponse[]>> => {
    const { data } = await apiClient.get<SuccessResponse<EditorResponse[]>>('/editors', { params });
    return data;
  },

  /**
   * Get editor by ID
   */
  getEditorById: async (id: string): Promise<SuccessResponse<EditorResponse>> => {
    const { data } = await apiClient.get<SuccessResponse<EditorResponse>>(`/editors/${id}`);
    return data;
  },

  /**
   * Create new editor
   */
  createEditor: async (payload: CreateEditorRequest): Promise<SuccessResponse<EditorResponse>> => {
    const { data } = await apiClient.post<SuccessResponse<EditorResponse>>('/editors', payload);
    return data;
  },

  /**
   * Update editor by ID
   */
  updateEditor: async (id: string, payload: UpdateEditorRequest): Promise<SuccessResponse<EditorResponse>> => {
    const { data } = await apiClient.patch<SuccessResponse<EditorResponse>>(`/editors/${id}`, payload);
    return data;
  },

  /**
   * Delete editor by ID
   */
  deleteEditor: async (id: string): Promise<SuccessResponse<null>> => {
    const { data } = await apiClient.delete<SuccessResponse<null>>(`/editors/${id}`);
    return data;
  },
};