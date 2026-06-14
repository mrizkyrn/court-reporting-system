'use client';

import { useState } from 'react';

import { JobForm } from '@/components/forms/JobForm';
import { Container } from '@/components/layouts/Container';
import { JobTable } from '@/components/tables/JobTable';
import { Button } from '@/components/ui/Button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/Dialog';
import { Pagination } from '@/components/ui/Pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useJobs } from '@/lib/hooks/queries/useJobQueries';
import { JobStatus } from '@/lib/types/job';

export default function JobsPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<JobStatus | 'ALL'>('ALL');
  const [open, setOpen] = useState(false);

  const { data, isLoading } = useJobs({
    page,
    limit: 10,
    status: status === 'ALL' ? undefined : [status],
  });

  return (
    <Container className="space-y-6 py-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Jobs</h1>
        <div className="flex items-center gap-4">
          <Select value={status} onValueChange={(value) => setStatus(value as JobStatus | 'ALL')}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {Object.values(JobStatus).map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>New Job</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Job</DialogTitle>
              </DialogHeader>
              <JobForm onSuccess={() => setOpen(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      

      <JobTable jobs={data?.data ?? []} isLoading={isLoading} />

      {data?.pagination && (
        <Pagination
          currentPage={data.pagination.page}
          totalPages={data.pagination.totalPages}
          onPageChange={setPage}
        />
      )}
    </Container>
  );
}