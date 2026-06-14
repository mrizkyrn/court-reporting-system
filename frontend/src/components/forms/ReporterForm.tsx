'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Checkbox';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { useCreateReporter } from '@/lib/hooks/mutations/useReporterMutations';
import { createReporterSchema, type CreateReporterInput } from '@/lib/schemas/reporter';

interface ReporterFormProps {
  onSuccess?: () => void;
}

export function ReporterForm({ onSuccess }: ReporterFormProps) {
  const form = useForm<CreateReporterInput>({
    resolver: zodResolver(createReporterSchema),
    defaultValues: {
      name: '',
      city: '',
      available: true,
      ratePerMin: 2000,
    },
    mode: 'onBlur',
  });

  const createReporter = useCreateReporter();

  const onSubmit = useCallback(
    (data: CreateReporterInput) => {
      createReporter.mutate(data, { onSuccess });
    },
    [createReporter, onSuccess]
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
                  disabled={createReporter.isPending}
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
                  disabled={createReporter.isPending}
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
                  disabled={createReporter.isPending}
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
                <Checkbox checked={field.value} onCheckedChange={field.onChange} disabled={createReporter.isPending} />
              </FormControl>

              <FormLabel className="!mt-0">Available</FormLabel>
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" isLoading={createReporter.isPending} loadingText="Saving...">
          Add Reporter
        </Button>
      </form>
    </Form>
  );
}
