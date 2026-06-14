'use client';

import { useRouter } from 'next/navigation';

import { JobStatusBadge } from '@/components/badges/JobStatusBadge';
import { TableSkeleton } from '@/components/tables/TableSkeleton';
import { EmptyState } from '@/components/ui/Empty';
import type { JobResponse } from '@/lib/types/job';

interface JobTableProps {
  jobs: JobResponse[];
  isLoading: boolean;
}

export function JobTable({ jobs, isLoading }: JobTableProps) {
  const router = useRouter();

  if (isLoading) {
    return <TableSkeleton columns={6} rows={5} />;
  }

  if (jobs.length === 0) {
    return <EmptyState title="No jobs found" description="Create a new job to get started." />;
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Case Name</th>
            <th className="px-4 py-3 text-left font-medium">Duration</th>
            <th className="px-4 py-3 text-left font-medium">Location</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-left font-medium">Reporter</th>
            <th className="px-4 py-3 text-left font-medium">Editor</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {jobs.map((job) => (
            <tr
              key={job.id}
              onClick={() => router.push(`/jobs/${job.id}`)}
              className="hover:bg-muted/30 cursor-pointer select-none"
            >
              <td className="px-4 py-3">{job.caseName}</td>
              <td className="px-4 py-3">{job.duration} min</td>
              <td className="px-4 py-3">
                {job.location}
                {job.city ? ` (${job.city})` : ''}
              </td>
              <td className="px-4 py-3">
                <JobStatusBadge status={job.status} />
              </td>
              <td className="px-4 py-3">{job.reporter?.name ?? '-'}</td>
              <td className="px-4 py-3">{job.editor?.name ?? '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
