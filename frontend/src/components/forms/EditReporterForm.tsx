'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { useUpdateReporter } from '@/lib/hooks/mutations/useReporterMutations';
import { updateReporterSchema, type UpdateReporterInput } from '@/lib/schemas/reporter';
import type { ReporterResponse } from '@/lib/types/reporter';

interface EditReporterFormProps {
  reporter: ReporterResponse;
  onSuccess?: () => void;
}

export function EditReporterForm({ reporter, onSuccess }: EditReporterFormProps) {
  const form = useForm<UpdateReporterInput>({
    resolver: zodResolver(updateReporterSchema),
    defaultValues: {
      name: reporter.name,
      city: reporter.city,
      available: reporter.available,
      ratePerMin: reporter.ratePerMin,
    },
    mode: 'onBlur',
  });

  const updateReporter = useUpdateReporter();

  const onSubmit = useCallback(
    (data: UpdateReporterInput) => {
      updateReporter.mutate(
        {
          id: reporter.id,
          data,
        },
        {
          onSuccess,
        }
      );
    },
    [updateReporter, reporter.id, onSuccess]
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
                  placeholder="Sarah Connor"
                  disabled={updateReporter.isPending}
                  aria-invalid={!!fieldState.error}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="city"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input
                  placeholder="Jakarta"
                  disabled={updateReporter.isPending}
                  aria-invalid={!!fieldState.error}
                  {...field}
                  value={field.value ?? ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ratePerMin"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Rate per Minute (IDR)</FormLabel>

              <FormControl>
                <Input
                  type="number"
                  min={0}
                  disabled={updateReporter.isPending}
                  aria-invalid={!!fieldState.error}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;

                    field.onChange(value === '' ? '' : Number(value));
                  }}
                  onBlur={field.onBlur}
                  name={field.name}
                  ref={field.ref}
                />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="available"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center space-y-0 space-x-2">
              <FormControl>
                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={updateReporter.isPending} />
              </FormControl>

              <FormLabel className="!mt-0">Available</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" isLoading={updateReporter.isPending} loadingText="Saving...">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
