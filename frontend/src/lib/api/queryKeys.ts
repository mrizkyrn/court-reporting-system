export const queryKeys = {
  jobs: {
    all: ['jobs'] as const,
    lists: () => [...queryKeys.jobs.all, 'list'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.jobs.lists(), params] as const,
    detail: (id: string) => [...queryKeys.jobs.all, 'detail', id] as const,
    payment: (id: string) => [...queryKeys.jobs.all, 'payment', id] as const,
    suggestedReporters: (id: string) => [...queryKeys.jobs.all, 'suggested-reporters', id] as const,
  },

  reporters: {
    all: ['reporters'] as const,
    lists: () => [...queryKeys.reporters.all, 'list'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.reporters.lists(), params] as const,
    detail: (id: string) => [...queryKeys.reporters.all, 'detail', id] as const,
  },

  editors: {
    all: ['editors'] as const,
    lists: () => [...queryKeys.editors.all, 'list'] as const,
    list: (params?: Record<string, unknown>) => [...queryKeys.editors.lists(), params] as const,
    detail: (id: string) => [...queryKeys.editors.all, 'detail', id] as const,
  },
};