'use client';

import { useState } from 'react';

import { EditEditorForm } from '@/components/forms/EditEditorForm';
import { EditorForm } from '@/components/forms/EditorForm';
import { Container } from '@/components/layouts/Container';
import { EditorTable } from '@/components/tables/EditorTable';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Pagination } from '@/components/ui/Pagination';
import { useDeleteEditor } from '@/lib/hooks/mutations/useEditorMutations';
import { useEditors } from '@/lib/hooks/queries/useEditorQueries';
import type { EditorResponse } from '@/lib/types/editor';

export default function EditorsPage() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editingEditor, setEditingEditor] = useState<EditorResponse | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const { data, isLoading } = useEditors({ page, limit: 10 });
  const deleteEditor = useDeleteEditor();

  const handleEdit = (editor: EditorResponse) => {
    setEditingEditor(editor);
    setEditOpen(true);
  };

  const handleDelete = (editorId: string) => {
    if (confirm('Are you sure you want to delete this editor?')) {
      deleteEditor.mutate(editorId);
    }
  };

  return (
    <Container className="space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Editors</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>New Editor</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Editor</DialogTitle>
            </DialogHeader>
            <EditorForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <EditorTable editors={data?.data ?? []} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Editor</DialogTitle>
          </DialogHeader>
          {editingEditor && <EditEditorForm editor={editingEditor} onSuccess={() => setEditOpen(false)} />}
        </DialogContent>
      </Dialog>

      {data?.pagination && (
        <Pagination currentPage={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
      )}
    </Container>
  );
}
