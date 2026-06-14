'use client';

import { Edit, Trash2 } from 'lucide-react';

import { TableSkeleton } from '@/components/tables/TableSkeleton';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/Empty';
import type { ReporterResponse } from '@/lib/types/reporter';

interface ReporterTableProps {
  reporters: ReporterResponse[];
  isLoading: boolean;
  onEdit?: (reporter: ReporterResponse) => void;
  onDelete?: (reporterId: string) => void;
}

export function ReporterTable({ reporters, isLoading, onEdit, onDelete }: ReporterTableProps) {
  if (isLoading) {
    return <TableSkeleton columns={4} rows={5} />;
  }

  if (reporters.length === 0) {
    return <EmptyState title="No reporters found" description="Add a reporter to get started." />;
  }

  return (
    <div className="overflow-x-auto rounded-md border">
      <table className="w-full text-sm">
        <thead className="bg-muted/50">
          <tr>
            <th className="px-4 py-3 text-left font-medium">Name</th>
            <th className="px-4 py-3 text-left font-medium">City</th>
            <th className="px-4 py-3 text-left font-medium">Rate / Minute</th>
            <th className="px-4 py-3 text-left font-medium">Available</th>
            <th className="px-4 py-3 text-left font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {reporters.map((reporter) => (
            <tr key={reporter.id} className="hover:bg-muted/30">
              <td className="px-4 py-3 font-medium">{reporter.name}</td>
              <td className="px-4 py-3">{reporter.city}</td>
              <td className="px-4 py-3">Rp{reporter.ratePerMin.toLocaleString('id-ID')}</td>
              <td className="px-4 py-3">{reporter.available ? 'Yes' : 'No'}</td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    onClick={() => onEdit?.(reporter)}
                    aria-label={`Edit ${reporter.name}`}
                  >
                    <Edit />
                  </Button>
                  <Button
                    variant="destructive"
                    size="icon-sm"
                    onClick={() => onDelete?.(reporter.id)}
                    aria-label={`Delete ${reporter.name}`}
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
