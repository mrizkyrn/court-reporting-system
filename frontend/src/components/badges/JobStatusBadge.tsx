import { cn } from '@/lib/utils/cn';
import { JobStatus } from '@/lib/types/job';

interface JobStatusBadgeProps {
  status: JobStatus;
  className?: string;
}

const STATUS_STYLES: Record<JobStatus, string> = {
  [JobStatus.NEW]: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  [JobStatus.ASSIGNED]: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
  [JobStatus.TRANSCRIBED]: 'bg-amber-100 text-amber-700 dark:bg-amber-900 dark:text-amber-300',
  [JobStatus.REVIEWED]: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
  [JobStatus.COMPLETED]: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
};

/**
 * Displays a colored badge representing the current job status.
 *
 * @example
 * <JobStatusBadge status={JobStatus.ASSIGNED} />
 */
export function JobStatusBadge({ status, className }: JobStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        STATUS_STYLES[status],
        className
      )}
    >
      {status}
    </span>
  );
}