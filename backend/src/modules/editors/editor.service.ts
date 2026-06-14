import { PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';

import { DI_TYPES } from '@/shared/constants';
import type { PaginationMeta } from '@/shared/types/response.type';
import { AppError } from '@/shared/utils/error.util';
import { calculatePagination, calculateSkip, normalizePaginationParams } from '@/shared/utils/pagination.util';
import { EDITOR_BASE_SELECT, mapEditorResponse, mapEditorsResponse } from './editor.mapper';
import type { CreateEditorBody, GetEditorsQuery, UpdateEditorBody } from './editor.schema';
import type { EditorResponse } from './editor.type';

@injectable()
export class EditorService {
  constructor(@inject(DI_TYPES.PrismaClient) private readonly prisma: PrismaClient) {}

  // ==================== Private Helper Methods ====================

  /**
   * Validates editor existence by ID
   * @param id - Editor ID to check
   */
  private async ensureEditorExists(id: string): Promise<void> {
    const exists = await this.prisma.editor.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!exists) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Editor not found');
    }
  }

  /**
   * Builds Prisma where clause for editor filtering
   * @param query - Query parameters for filtering
   * @returns Prisma where clause object
   */
  private buildEditorWhereClause(query: GetEditorsQuery) {
    const { search } = query;

    return {
      ...(search && {
        name: { contains: search, mode: 'insensitive' as const },
      }),
    };
  }

  // ==================== Editor Queries ====================

  /**
   * Retrieves paginated editors with filtering and sorting
   * @param query - Query parameters for pagination, filtering and sorting
   * @returns Paginated editor list with metadata
   */
  async getEditors(query: GetEditorsQuery): Promise<{ editors: EditorResponse[]; pagination: PaginationMeta }> {
    const { page, limit } = normalizePaginationParams(query.page, query.limit);
    const { sortBy, sortOrder } = query;
    const skip = calculateSkip(page, limit);
    const where = this.buildEditorWhereClause(query);

    const [total, editors] = await Promise.all([
      this.prisma.editor.count({ where }),
      this.prisma.editor.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: EDITOR_BASE_SELECT,
      }),
    ]);

    const pagination = calculatePagination(page, limit, total);

    return { editors: mapEditorsResponse(editors), pagination };
  }

  /**
   * Retrieves editor by ID
   * @param id - Editor ID to fetch
   * @returns Editor response object
   */
  async getEditorById(id: string): Promise<EditorResponse> {
    const editor = await this.prisma.editor.findUnique({
      where: { id },
      select: EDITOR_BASE_SELECT,
    });

    if (!editor) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Editor not found');
    }

    return mapEditorResponse(editor);
  }

  // ==================== Editor Management ====================

  /**
   * Creates new editor
   * @param data - Editor creation data
   * @returns Created editor response
   */
  async createEditor(data: CreateEditorBody): Promise<EditorResponse> {
    const editor = await this.prisma.editor.create({
      data,
      select: EDITOR_BASE_SELECT,
    });

    return mapEditorResponse(editor);
  }

  /**
   * Updates editor information
   * @param id - Editor ID to update
   * @param data - Update data
   * @returns Updated editor response
   */
  async updateEditor(id: string, data: UpdateEditorBody): Promise<EditorResponse> {
    await this.ensureEditorExists(id);

    const editor = await this.prisma.editor.update({
      where: { id },
      data,
      select: EDITOR_BASE_SELECT,
    });

    return mapEditorResponse(editor);
  }

  /**
   * Deletes editor
   * @param id - Editor ID to delete
   */
  async deleteEditor(id: string): Promise<void> {
    await this.ensureEditorExists(id);

    await this.prisma.editor.delete({
      where: { id },
    });
  }
}