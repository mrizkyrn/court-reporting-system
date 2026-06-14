'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useAssignReporter } from '@/lib/hooks/mutations/useJobMutations';
import { useSuggestedReporters } from '@/lib/hooks/queries/useJobQueries';
import { assignReporterSchema, type AssignReporterInput } from '@/lib/schemas/job';

interface AssignReporterFormProps {
  jobId: string;
  onSuccess?: () => void;
}

/**
 * Form to assign a suggested reporter to a job.
 * Reporters are pre-filtered by the backend (same city for physical jobs, falling back to all available reporters).
 */
export function AssignReporterForm({ jobId, onSuccess }: AssignReporterFormProps) {
  const { data, isLoading } = useSuggestedReporters(jobId);
  const assignReporter = useAssignReporter();

  const form = useForm<AssignReporterInput>({
    resolver: zodResolver(assignReporterSchema),
    defaultValues: { reporterId: '' },
  });

  const onSubmit = useCallback(
    (data: AssignReporterInput) => {
      assignReporter.mutate({ id: jobId, data }, { onSuccess });
    },
    [assignReporter, jobId, onSuccess]
  );

  const reporters = data?.data ?? [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="reporterId"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Reporter</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading || assignReporter.isPending}
                >
                  <SelectTrigger aria-invalid={!!fieldState.error}>
                    <SelectValue placeholder={isLoading ? 'Loading reporters...' : 'Select a reporter'} />
                  </SelectTrigger>
                  <SelectContent>
                    {reporters.map((reporter) => (
                      <SelectItem key={reporter.id} value={reporter.id}>
                        {reporter.name} — {reporter.city} (Rp{reporter.ratePerMin.toLocaleString('id-ID')}/min)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" isLoading={assignReporter.isPending} loadingText="Assigning...">
          Assign Reporter
        </Button>
      </form>
    </Form>
  );
}