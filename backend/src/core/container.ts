import 'reflect-metadata';

import type { PrismaClient } from '@prisma/client';
import { container } from 'tsyringe';

import { prisma } from '@/infrastructure/database/prisma.client';
import { ILogger, logger } from '@/infrastructure/logging/winston.logger';
import { DI_TYPES } from '@/shared/constants';
import { JobService } from '@/modules/jobs/job.service';
import { ReporterService } from '@/modules/reporters/reporter.service';
import { EditorService } from '@/modules/editors/editor.service';

// ======================= Libraries  =======================

container.register<PrismaClient>(DI_TYPES.PrismaClient, { useValue: prisma });
container.register<ILogger>(DI_TYPES.Logger, { useValue: logger });

// ======================= Domain Services =======================

container.registerSingleton<JobService>(DI_TYPES.JobService, JobService);
container.registerSingleton<ReporterService>(DI_TYPES.ReporterService, ReporterService);
container.registerSingleton<EditorService>(DI_TYPES.EditorService, EditorService);

export { container };
