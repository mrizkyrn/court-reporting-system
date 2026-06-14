import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

import { IdParam } from '@/shared/schemas/common.schema';
import { sendSuccess, sendSuccessWithPagination } from '@/shared/utils/response.util';
import { assertType } from '@/shared/utils/type.util';
import type {
  AssignEditorBody,
  AssignReporterBody,
  CreateJobBody,
  GetJobsQuery,
  UpdateJobStatusBody,
} from './job.schema';
import type { JobService } from './job.service';
import type { JobResponse, PaymentBreakdownResponse, ReporterSummary } from './job.type';

export class JobController {
  constructor(private readonly jobService: JobService) {}

  // ==================== Job Queries ====================

  async getJobs(req: Request, res: Response, next: NextFunction) {
    const query = assertType<GetJobsQuery>(req.query);
    const { jobs, pagination } = await this.jobService.getJobs(query);
    sendSuccessWithPagination<JobResponse[]>(res, StatusCodes.OK, 'Jobs retrieved successfully', jobs, pagination);
  }

  async getJobById(req: Request<IdParam>, res: Response, next: NextFunction) {
    const { id } = req.params;
    const job = await this.jobService.getJobById(id);
    sendSuccess<JobResponse>(res, StatusCodes.OK, 'Job retrieved successfully', job);
  }

  // ==================== Job Management ====================

  async createJob(req: Request<{}, {}, CreateJobBody>, res: Response, next: NextFunction) {
    const job = await this.jobService.createJob(req.body);
    sendSuccess<JobResponse>(res, StatusCodes.CREATED, 'Job created successfully', job);
  }

  async updateStatus(req: Request<IdParam, {}, UpdateJobStatusBody>, res: Response, next: NextFunction) {
    const { id } = req.params;
    const job = await this.jobService.updateStatus(id, req.body.status);
    sendSuccess<JobResponse>(res, StatusCodes.OK, 'Job status updated successfully', job);
  }

  // ==================== Assignment ====================

  async getSuggestedReporters(req: Request<IdParam>, res: Response, next: NextFunction) {
    const { id } = req.params;
    const reporters = await this.jobService.suggestReporters(id);
    sendSuccess<ReporterSummary[]>(res, StatusCodes.OK, 'Suggested reporters retrieved successfully', reporters);
  }

  async assignReporter(req: Request<IdParam, {}, AssignReporterBody>, res: Response, next: NextFunction) {
    const { id } = req.params;
    const job = await this.jobService.assignReporter(id, req.body.reporterId);
    sendSuccess<JobResponse>(res, StatusCodes.OK, 'Reporter assigned successfully', job);
  }

  async assignEditor(req: Request<IdParam, {}, AssignEditorBody>, res: Response, next: NextFunction) {
    const { id } = req.params;
    const job = await this.jobService.assignEditor(id, req.body.editorId);
    sendSuccess<JobResponse>(res, StatusCodes.OK, 'Editor assigned successfully', job);
  }

  // ==================== Payment ====================

  async calculatePayment(req: Request<IdParam>, res: Response, next: NextFunction) {
    const { id } = req.params;
    const breakdown = await this.jobService.calculatePayment(id);
    sendSuccess<PaymentBreakdownResponse>(res, StatusCodes.OK, 'Payment calculated successfully', breakdown);
  }
}