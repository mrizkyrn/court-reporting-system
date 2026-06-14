'use client';

import { ArrowLeft } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { JobStatusBadge } from '@/components/badges/JobStatusBadge';
import { PaymentSummaryCard } from '@/components/cards/PaymentSummaryCard';
import { AssignEditorForm } from '@/components/forms/AssignEditorForm';
import { AssignReporterForm } from '@/components/forms/AssignReporterForm';
import { Container } from '@/components/layouts/Container';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Spinner } from '@/components/ui/Spinner';
import { useUpdateJobStatus } from '@/lib/hooks/mutations/useJobMutations';
import { useJob } from '@/lib/hooks/queries/useJobQueries';
import { JobStatus } from '@/lib/types/job';

// ==================== Workflow Step Components ====================

/**
 * NEW: Shows the assign reporter form.
 */
function NewStep({ jobId }: { jobId: string }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Assign Reporter</CardTitle>
        <p className="text-muted-foreground text-sm">
          Assign a court reporter to begin transcription. The job will move to <strong>Assigned</strong> automatically.
        </p>
      </CardHeader>
      <CardContent>
        <AssignReporterForm jobId={jobId} />
      </CardContent>
    </Card>
  );
}

/**
 * ASSIGNED: Shows a single action to mark transcription as complete.
 */
function AssignedStep({ jobId }: { jobId: string }) {
  const updateStatus = useUpdateJobStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transcription In Progress</CardTitle>
        <p className="text-muted-foreground text-sm">
          The reporter is working on the transcript. Mark it complete once the transcript is ready for review.
        </p>
      </CardHeader>
      <CardContent>
        <Button
          isLoading={updateStatus.isPending}
          loadingText="Updating..."
          onClick={() => updateStatus.mutate({ id: jobId, data: { status: JobStatus.TRANSCRIBED } })}
        >
          Mark Transcript Complete
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * TRANSCRIBED: Shows assign editor form first.
 */
function TranscribedStep({ jobId, hasEditor }: { jobId: string; hasEditor: boolean }) {
  const updateStatus = useUpdateJobStatus();

  return (
    <div className="space-y-4">
      {!hasEditor ? (
        <Card>
          <CardHeader>
            <CardTitle>Assign Editor</CardTitle>
            <p className="text-muted-foreground text-sm">
              Assign an editor to review the transcript. This does not change the job status.
            </p>
          </CardHeader>
          <CardContent>
            <AssignEditorForm jobId={jobId} />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Review In Progress</CardTitle>
            <p className="text-muted-foreground text-sm">
              The editor is reviewing the transcript. Mark it complete once the review is approved.
            </p>
          </CardHeader>
          <CardContent>
            <Button
              isLoading={updateStatus.isPending}
              loadingText="Updating..."
              onClick={() => updateStatus.mutate({ id: jobId, data: { status: JobStatus.REVIEWED } })}
            >
              Mark Review Complete
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * REVIEWED: Shows a single action to mark the job as fully completed.
 */
function ReviewedStep({ jobId }: { jobId: string }) {
  const updateStatus = useUpdateJobStatus();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Ready to Complete</CardTitle>
        <p className="text-muted-foreground text-sm">
          The transcript has been reviewed and approved. Mark the job as completed to finalize it.
        </p>
      </CardHeader>
      <CardContent>
        <Button
          isLoading={updateStatus.isPending}
          loadingText="Completing..."
          onClick={() => updateStatus.mutate({ id: jobId, data: { status: JobStatus.COMPLETED } })}
        >
          Mark Completed
        </Button>
      </CardContent>
    </Card>
  );
}

/**
 * COMPLETED: Terminal state, no further actions available.
 */
function CompletedStep() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Completed</CardTitle>
        <p className="text-muted-foreground text-sm">
          This job has been fully completed. No further actions are available.
        </p>
      </CardHeader>
    </Card>
  );
}

// ==================== Status Timeline ====================

const STATUS_ORDER: JobStatus[] = [
  JobStatus.NEW,
  JobStatus.ASSIGNED,
  JobStatus.TRANSCRIBED,
  JobStatus.REVIEWED,
  JobStatus.COMPLETED,
];

const STATUS_LABELS: Record<JobStatus, string> = {
  [JobStatus.NEW]: 'New',
  [JobStatus.ASSIGNED]: 'Assigned',
  [JobStatus.TRANSCRIBED]: 'Transcribed',
  [JobStatus.REVIEWED]: 'Reviewed',
  [JobStatus.COMPLETED]: 'Completed',
};

function StatusTimeline({ current }: { current: JobStatus }) {
  const currentIndex = STATUS_ORDER.indexOf(current);

  return (
    <div className="flex items-center gap-0">
      {STATUS_ORDER.map((status, index) => {
        const isDone = index < currentIndex;
        const isActive = index === currentIndex;
        const isLast = index === STATUS_ORDER.length - 1;

        return (
          <div key={status} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div
                className={[
                  'flex h-7 w-7 items-center justify-center rounded-full text-xs font-semibold transition-colors',
                  isDone
                    ? 'bg-primary text-primary-foreground'
                    : isActive
                      ? 'ring-primary bg-background ring-2'
                      : 'bg-muted text-muted-foreground',
                ].join(' ')}
              >
                {isDone ? '✓' : index + 1}
              </div>
              <span
                className={[
                  'text-xs font-medium whitespace-nowrap',
                  isActive ? 'text-foreground' : isDone ? 'text-primary' : 'text-muted-foreground',
                ].join(' ')}
              >
                {STATUS_LABELS[status]}
              </span>
            </div>

            {!isLast && (
              <div
                className={['mb-5 h-0.5 w-8 flex-shrink-0', index < currentIndex ? 'bg-primary' : 'bg-muted'].join(' ')}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ==================== Page ====================

export default function JobDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading } = useJob(id);

  if (isLoading) {
    return (
      <Container className="flex justify-center py-16">
        <Spinner />
      </Container>
    );
  }

  const job = data?.data;
  if (!job) {
    return (
      <Container className="py-8">
        <p className="text-muted-foreground">Job not found.</p>
      </Container>
    );
  }

  return (
    <Container className="space-y-8 py-8">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-6">
          <button
            onClick={() => router.back()}
            className="text-muted-foreground hover:text-foreground flex items-center gap-2 text-sm font-medium transition-colors"
          >
            <ArrowLeft className="h-8 w-8" />
          </button>

          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold">{job.caseName}</h1>
            <p className="text-muted-foreground text-sm">
              {job.duration} min • {job.location}
              {job.city ? ` (${job.city})` : ''}
            </p>
          </div>
        </div>

        <JobStatusBadge status={job.status} />
      </div>

      {/* Status Timeline */}
      <div className="overflow-x-auto">
        <StatusTimeline current={job.status} />
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Left: Workflow Action */}
        <div className="space-y-4">
          {job.status === JobStatus.NEW && <NewStep jobId={job.id} />}
          {job.status === JobStatus.ASSIGNED && <AssignedStep jobId={job.id} />}
          {job.status === JobStatus.TRANSCRIBED && <TranscribedStep jobId={job.id} hasEditor={!!job.editor} />}
          {job.status === JobStatus.REVIEWED && <ReviewedStep jobId={job.id} />}
          {job.status === JobStatus.COMPLETED && <CompletedStep />}

          {/* Assignments Summary — always visible */}
          <Card>
            <CardHeader>
              <CardTitle>Assignments</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Reporter</span>
                <span>{job.reporter ? `${job.reporter.name} (${job.reporter.city})` : 'Not assigned'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Editor</span>
                <span>{job.editor ? job.editor.name : 'Not assigned'}</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Payment Summary */}
        <PaymentSummaryCard jobId={job.id} />
      </div>
    </Container>
  );
}
