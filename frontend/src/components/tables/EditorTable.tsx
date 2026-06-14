'use client';

import { Edit, Trash2 } from 'lucide-react';

import { TableSkeleton } from '@/components/tables/TableSkeleton';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Empty';
import type { EditorResponse } from '@/lib/types/editor';

interface EditorTableProps {
  editors: EditorResponse[];
  isLoading: boolean;
  onEdit?: (editor: EditorResponse) => void;
  onDelete?: (editorId: string) => void;
}

export function EditorTable({ editors, isLoading, onEdit, onDelete }: EditorTableProps) {
  if (isLoading) {
    return <TableSkeleton columns={2} rows={5} />;
  }

  if (editors.length === 0) {
    return <EmptyState title="No editors found" description="Add an editor to get started." />;
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">Flat Fee</th>
            <th className="px-4 py-3 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {editors.map((editor) => (
            <tr key={editor.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{editor.name}</td>
              <td className="px-4 py-3">Rp{editor.flatFee.toLocaleString('id-ID')}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onEdit?.(editor)}
                    aria-label={`Edit ${editor.name}`}
                  >
                    <Edit />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => onDelete?.(editor.id)}
                    aria-label={`Delete ${editor.name}`}
                  >
                    <Trash2 />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
