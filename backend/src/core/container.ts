import 'reflect-metadata';

import type { PrismaClient } from '@prisma/client';
import { container } from 'tsyringe';

import { prisma } from '@/infrastructure/database/prisma.client';
import { ILogger, logger } from '@/infrastructure/logging/winston.logger';
import { DI_TYPES } from '@/shared/constants';

// ======================= Libraries  =======================

container.register<PrismaClient>(DI_TYPES.PrismaClient, { useValue: prisma });
container.register<ILogger>(DI_TYPES.Logger, { useValue: logger });

// ======================= Domain Services =======================


export { container };
