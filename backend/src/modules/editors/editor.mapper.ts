import { Prisma } from '@prisma/client';

import type { EditorResponse } from './editor.type';

export const EDITOR_BASE_SELECT = {
  id: true,
  name: true,
  flatFee: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.EditorSelect;

export type EditorWithSelect = Prisma.EditorGetPayload<{ select: typeof EDITOR_BASE_SELECT }>;

export function mapEditorResponse(editor: EditorWithSelect): EditorResponse {
  return {
    id: editor.id,
    name: editor.name,
    flatFee: editor.flatFee,
    createdAt: editor.createdAt,
    updatedAt: editor.updatedAt,
  };
}

export function mapEditorsResponse(editors: EditorWithSelect[]): EditorResponse[] {
  return editors.map(mapEditorResponse);
}