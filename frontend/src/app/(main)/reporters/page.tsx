'use client';

import { useState } from 'react';

import { EditReporterForm } from '@/components/forms/EditReporterForm';
import { ReporterForm } from '@/components/forms/ReporterForm';
import { Container } from '@/components/layouts/Container';
import { ReporterTable } from '@/components/tables/ReporterTable';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Pagination } from '@/components/ui/Pagination';
import { useDeleteReporter } from '@/lib/hooks/mutations/useReporterMutations';
import { useReporters } from '@/lib/hooks/queries/useReporterQueries';
import type { ReporterResponse } from '@/lib/types/reporter';

export default function ReportersPage() {
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(false);
  const [editingReporter, setEditingReporter] = useState<ReporterResponse | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const { data, isLoading } = useReporters({ page, limit: 10 });
  const deleteReporter = useDeleteReporter();

  const handleEdit = (reporter: ReporterResponse) => {
    setEditingReporter(reporter);
    setEditOpen(true);
  };

  const handleDelete = (reporterId: string) => {
    if (confirm('Are you sure you want to delete this reporter?')) {
      deleteReporter.mutate(reporterId);
    }
  };

  return (
    <Container className="space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Reporters</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>New Reporter</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Reporter</DialogTitle>
            </DialogHeader>
            <ReporterForm onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <ReporterTable reporters={data?.data ?? []} isLoading={isLoading} onEdit={handleEdit} onDelete={handleDelete} />

      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Reporter</DialogTitle>
          </DialogHeader>
          {editingReporter && <EditReporterForm reporter={editingReporter} onSuccess={() => setEditOpen(false)} />}
        </DialogContent>
      </Dialog>

      {data?.pagination && (
        <Pagination currentPage={data.pagination.page} totalPages={data.pagination.totalPages} onPageChange={setPage} />
      )}
    </Container>
  );
}
