'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';

import { Button } from '@/components/ui/Button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/Form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { useAssignEditor } from '@/lib/hooks/mutations/useJobMutations';
import { useEditors } from '@/lib/hooks/queries/useEditorQueries';
import { assignEditorSchema, type AssignEditorInput } from '@/lib/schemas/job';

interface AssignEditorFormProps {
  jobId: string;
  onSuccess?: () => void;
}

export function AssignEditorForm({ jobId, onSuccess }: AssignEditorFormProps) {
  const { data, isLoading } = useEditors({ limit: 100 });
  const assignEditor = useAssignEditor();

  const form = useForm<AssignEditorInput>({
    resolver: zodResolver(assignEditorSchema),
    defaultValues: { editorId: '' },
  });

  const onSubmit = useCallback(
    (data: AssignEditorInput) => {
      assignEditor.mutate({ id: jobId, data }, { onSuccess });
    },
    [assignEditor, jobId, onSuccess]
  );

  const editors = data?.data ?? [];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="editorId"
          render={({ field, fieldState }) => (
            <FormItem>
              <FormLabel>Editor</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading || assignEditor.isPending}
                >
                  <SelectTrigger aria-invalid={!!fieldState.error}>
                    <SelectValue placeholder={isLoading ? 'Loading editors...' : 'Select an editor'} />
                  </SelectTrigger>
                  <SelectContent>
                    {editors.map((editor) => (
                      <SelectItem key={editor.id} value={editor.id}>
                        {editor.name} — Rp{editor.flatFee.toLocaleString('id-ID')}/job
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" isLoading={assignEditor.isPending} loadingText="Assigning...">
          Assign Editor
        </Button>
      </form>
    </Form>
  );
}