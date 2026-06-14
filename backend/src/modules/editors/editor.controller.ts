import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IdParam } from '@/shared/schemas/common.schema';
import { sendSuccess, sendSuccessWithPagination } from '@/shared/utils/response.util';
import { assertType } from '@/shared/utils/type.util';
import type { CreateEditorBody, GetEditorsQuery, UpdateEditorBody } from './editor.schema';
import type { EditorService } from './editor.service';
import type { EditorResponse } from './editor.type';

export class EditorController {
  constructor(private readonly editorService: EditorService) {}

  // ==================== Editor Queries ====================

  async getEditors(req: Request, res: Response, next: NextFunction) {
    const query = assertType<GetEditorsQuery>(req.query);
    const { editors, pagination } = await this.editorService.getEditors(query);
    sendSuccessWithPagination<EditorResponse[]>(res, StatusCodes.OK, 'Editors retrieved successfully', editors, pagination);
  }

  async getEditorById(req: Request<IdParam>, res: Response, next: NextFunction) {
    const { id } = req.params;
    const editor = await this.editorService.getEditorById(id);
    sendSuccess<EditorResponse>(res, StatusCodes.OK, 'Editor retrieved successfully', editor);
  }

  // ==================== Editor Management ====================

  async createEditor(req: Request<{}, {}, CreateEditorBody>, res: Response, next: NextFunction) {
    const editor = await this.editorService.createEditor(req.body);
    sendSuccess<EditorResponse>(res, StatusCodes.CREATED, 'Editor created successfully', editor);
  }

  async updateEditor(req: Request<IdParam, {}, UpdateEditorBody>, res: Response, next: NextFunction) {
    const { id } = req.params;
    const editor = await this.editorService.updateEditor(id, req.body);
    sendSuccess<EditorResponse>(res, StatusCodes.OK, 'Editor updated successfully', editor);
  }

  async deleteEditor(req: Request<IdParam>, res: Response, next: NextFunction) {
    const { id } = req.params;
    await this.editorService.deleteEditor(id);
    sendSuccess(res, StatusCodes.OK, 'Editor deleted successfully');
  }
}