'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useCreateJob } from '@/lib/hooks/mutations/useJobMutations';
import { createJobSchema, type CreateJobInput } from '@/lib/schemas/job';
import { JobLocation } from '@/lib/types/job';

interface JobFormProps {
  onSuccess?: () => void;
}

export function JobForm({ onSuccess }: JobFormProps) {
  const form = useForm<CreateJobInput>({
    resolver: zodResolver(createJobSchema) as any,
    defaultValues: {
      caseName: '',
      duration: undefined,
      location: JobLocation.REMOTE,
      city: '',
    },
    mode: 'onBlur',
  });

  const createJob = useCreateJob();
  const location = form.watch('location');

  const onSubmit = useCallback(
    (data: CreateJobInput) => {
      createJob.mutate(
        {
          ...data,
          city: data.location === JobLocation.PHYSICAL ? data.city : undefined,
        },
        { onSuccess }
      );
    },
    [createJob, onSuccess]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="caseName"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Case Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder="State v. Johnson"
                    disabled={createJob.isPending}
                    aria-invalid={!!fieldState.error}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duration"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={1}
                    placeholder="120"
                    disabled={createJob.isPending}
                    aria-invalid={!!fieldState.error}
                    {...field}
                    onChange={(e) => field.onChange(e.target.value === '' ? undefined : Number(e.target.value))}
                    value={field.value ?? ''}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field, fieldState }) => (
              <FormItem>
                <FormLabel>Location Type</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    disabled={createJob.isPending}
                  >
                    <SelectTrigger aria-invalid={!!fieldState.error}>
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={JobLocation.REMOTE}>Remote</SelectItem>
                      <SelectItem value={JobLocation.PHYSICAL}>Physical</SelectItem>
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {location === JobLocation.PHYSICAL && (
            <FormField
              control={form.control}
              name="city"
              render={({ field, fieldState }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Jakarta"
                      disabled={createJob.isPending}
                      aria-invalid={!!fieldState.error}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>

        <Button type="submit" className="w-full" isLoading={createJob.isPending} loadingText="Creating job...">
          Create Job
        </Button>
      </form>
    </Form>
  );
}