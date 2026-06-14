import { Prisma, PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';

import { DI_TYPES } from '@/shared/constants';
import type { PaginationMeta } from '@/shared/types/response.type';
import { AppError } from '@/shared/utils/error.util';
import { calculatePagination, calculateSkip, normalizePaginationParams } from '@/shared/utils/pagination.util';
import { mapReporterResponse, mapReportersResponse, REPORTER_BASE_SELECT } from './reporter.mapper';
import type { CreateReporterBody, GetReportersQuery, UpdateReporterBody } from './reporter.schema';
import type { ReporterResponse } from './reporter.type';

@injectable()
export class ReporterService {
  constructor(@inject(DI_TYPES.PrismaClient) private readonly prisma: PrismaClient) {}

  // ==================== Private Helper Methods ====================

  /**
   * Validates reporter existence by ID
   * @param id - Reporter ID to check
   */
  private async ensureReporterExists(id: string): Promise<void> {
    const exists = await this.prisma.reporter.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Reporter not found');
    }
  }

  /**
   * Builds Prisma where clause for reporter filtering
   * @param query - Query parameters for filtering
   * @returns Prisma where clause object
   */
  private buildReporterWhereClause(query: GetReportersQuery): Prisma.ReporterWhereInput {
    const { search, available } = query;

    return {
      ...(available !== undefined && { available }),
      ...(search && {
        OR: [{ name: { contains: search, mode: 'insensitive' } }, { city: { contains: search, mode: 'insensitive' } }],
      }),
    };
  }

  // ==================== Reporter Queries ====================

  /**
   * Retrieves paginated reporters with filtering and sorting
   * @param query - Query parameters for pagination, filtering and sorting
   * @returns Paginated reporter list with metadata
   */
  async getReporters(query: GetReportersQuery): Promise<{ reporters: ReporterResponse[]; pagination: PaginationMeta }> {
    const { page, limit } = normalizePaginationParams(query.page, query.limit);
    const { sortBy, sortOrder } = query;
    const skip = calculateSkip(page, limit);
    const where = this.buildReporterWhereClause(query);

    const [total, reporters] = await Promise.all([
      this.prisma.reporter.count({ where }),
      this.prisma.reporter.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: REPORTER_BASE_SELECT,
      }),
    ]);

    const pagination = calculatePagination(page, limit, total);

    return { reporters: mapReportersResponse(reporters), pagination };
  }

  /**
   * Retrieves reporter by ID
   * @param id - Reporter ID to fetch
   * @returns Reporter response object
   */
  async getReporterById(id: string): Promise<ReporterResponse> {
    const reporter = await this.prisma.reporter.findUnique({
      where: { id },
      select: REPORTER_BASE_SELECT,
    });

    if (!reporter) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Reporter not found');
    }

    return mapReporterResponse(reporter);
  }

  // ==================== Reporter Management ====================

  /**
   * Creates new reporter
   * @param data - Reporter creation data
   * @returns Created reporter response
   */
  async createReporter(data: CreateReporterBody): Promise<ReporterResponse> {
    const reporter = await this.prisma.reporter.create({
      data,
      select: REPORTER_BASE_SELECT,
    });

    return mapReporterResponse(reporter);
  }

  /**
   * Updates reporter information
   * @param id - Reporter ID to update
   * @param data - Update data
   * @returns Updated reporter response
   */
  async updateReporter(id: string, data: UpdateReporterBody): Promise<ReporterResponse> {
    await this.ensureReporterExists(id);

    const reporter = await this.prisma.reporter.update({
      where: { id },
      data,
      select: REPORTER_BASE_SELECT,
    });

    return mapReporterResponse(reporter);
  }

  /**
   * Deletes reporter
   * @param id - Reporter ID to delete
   */
  async deleteReporter(id: string): Promise<void> {
    await this.ensureReporterExists(id);

    await this.prisma.reporter.delete({
      where: { id },
    });
  }
}