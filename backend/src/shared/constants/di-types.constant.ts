export const DI_TYPES = {
  // ==================== Services ====================
  JobService: Symbol.for('JobService'),
  ReporterService: Symbol.for('ReporterService'),
  EditorService: Symbol.for('EditorService'),

  // ==================== Infrastructure ====================
  PrismaClient: Symbol.for('PrismaClient'),
  Logger: Symbol.for('Logger'),
} as const;

export const TYPES = DI_TYPES;
