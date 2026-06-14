'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Input } from '@/components/ui/Input';
import { useUpdateEditor } from '@/lib/hooks/mutations/useEditorMutations';
import { updateEditorSchema, type UpdateEditorInput } from '@/lib/schemas/editor';
import type { EditorResponse } from '@/lib/types/editor';

interface EditEditorFormProps {
  editor: EditorResponse;
  onSuccess?: () => void;
}

export function EditEditorForm({ editor, onSuccess }: EditEditorFormProps) {
  const form = useForm<UpdateEditorInput>({
    resolver: zodResolver(updateEditorSchema),
    defaultValues: {
      name: editor.name,
      flatFee: editor.flatFee,
    },
    mode: 'onBlur',
  });

  const updateEditor = useUpdateEditor();

  const onSubmit = useCallback(
    (data: UpdateEditorInput) => {
      updateEditor.mutate(
        {
          id: editor.id,
          data,
        },
        {
          onSuccess,
        }
      );
    },
    [updateEditor, editor.id, onSuccess]
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
                  disabled={updateEditor.isPending}
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
          name="flatFee"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Flat Fee per Job (IDR)</FormLabel>

              <FormControl>
                <Input
                  type="number"
                  min={0}
                  disabled={updateEditor.isPending}
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

        <Button type="submit" className="w-full" isLoading={updateEditor.isPending} loadingText="Saving...">
          Save Changes
        </Button>
      </form>
    </Form>
  );
}
