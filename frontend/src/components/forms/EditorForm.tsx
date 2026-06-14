'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { useCreateEditor } from '@/lib/hooks/mutations/useEditorMutations';
import { createEditorSchema, type CreateEditorInput } from '@/lib/schemas/editor';

interface EditorFormProps {
  onSuccess?: () => void;
}

export function EditorForm({ onSuccess }: EditorFormProps) {
  const form = useForm<CreateEditorInput>({
    resolver: zodResolver(createEditorSchema),
    defaultValues: {
      name: '',
      flatFee: 50000,
    },
    mode: 'onBlur',
  });

  const createEditor = useCreateEditor();

  const onSubmit = useCallback(
    (data: CreateEditorInput) => {
      createEditor.mutate(data, { onSuccess });
    },
    [createEditor, onSuccess]
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
                  placeholder="John Editor"
                  disabled={createEditor.isPending}
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
          name="flatFee"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Flat Fee per Job (IDR)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min={0}
                  disabled={createEditor.isPending}
                  aria-invalid={!!fieldState.error}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;

                    field.onChange(value === '' ? '' : Number(value));
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" isLoading={createEditor.isPending} loadingText="Saving...">
          Add Editor
        </Button>
      </form>
    </Form>
  );
}
