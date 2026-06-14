import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IdParam } from '@/shared/schemas/common.schema';
import { sendSuccess, sendSuccessWithPagination } from '@/shared/utils/response.util';
import { assertType } from '@/shared/utils/type.util';
import type { CreateReporterBody, GetReportersQuery, UpdateReporterBody } from './reporter.schema';
import type { ReporterService } from './reporter.service';
import type { ReporterResponse } from './reporter.type';

export class ReporterController {
  constructor(private readonly reporterService: ReporterService) {}

  // ==================== Reporter Queries ====================

  async getReporters(req: Request, res: Response, next: NextFunction) {
    const query = assertType<GetReportersQuery>(req.query);
    const { reporters, pagination } = await this.reporterService.getReporters(query);
    sendSuccessWithPagination<ReporterResponse[]>(res, StatusCodes.OK, 'Reporters retrieved successfully', reporters, pagination);
  }

  async getReporterById(req: Request<IdParam>, res: Response, next: NextFunction) {
    const { id } = req.params;
    const reporter = await this.reporterService.getReporterById(id);
    sendSuccess<ReporterResponse>(res, StatusCodes.OK, 'Reporter retrieved successfully', reporter);
  }

  // ==================== Reporter Management ====================

  async createReporter(req: Request<{}, {}, CreateReporterBody>, res: Response, next: NextFunction) {
    const reporter = await this.reporterService.createReporter(req.body);
    sendSuccess<ReporterResponse>(res, StatusCodes.CREATED, 'Reporter created successfully', reporter);
  }

  async updateReporter(req: Request<IdParam, {}, UpdateReporterBody>, res: Response, next: NextFunction) {
    const { id } = req.params;
    const reporter = await this.reporterService.updateReporter(id, req.body);
    sendSuccess<ReporterResponse>(res, StatusCodes.OK, 'Reporter updated successfully', reporter);
  }

  async deleteReporter(req: Request<IdParam>, res: Response, next: NextFunction) {
    const { id } = req.params;
    await this.reporterService.deleteReporter(id);
    sendSuccess(res, StatusCodes.OK, 'Reporter deleted successfully');
  }
}