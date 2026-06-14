import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/api/queryKeys';
import { editorApi } from '@/lib/api/services/editorService';
import type { GetEditorsParams } from '@/lib/types/editor';

/**
 * Get paginated list of editors
 */
export const useEditors = (params?: GetEditorsParams) => {
  return useQuery({
    queryKey: queryKeys.editors.list(params as Record<string, unknown>),
    queryFn: () => editorApi.getEditors(params),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

/**
 * Get editor by ID
 */
export const useEditor = (id: string) => {
  return useQuery({
    queryKey: queryKeys.editors.detail(id),
    queryFn: () => editorApi.getEditorById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};