import { JobLocation, JobStatus, Prisma, PrismaClient } from '@prisma/client';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'tsyringe';

import { DI_TYPES } from '@/shared/constants';
import type { PaginationMeta } from '@/shared/types/response.type';
import { AppError } from '@/shared/utils/error.util';
import { calculatePagination, calculateSkip, normalizePaginationParams } from '@/shared/utils/pagination.util';
import { JOB_BASE_SELECT, mapJobResponse, mapJobsResponse } from './job.mapper';
import type { CreateJobBody, GetJobsQuery } from './job.schema';
import type { JobResponse, PaymentBreakdownResponse, ReporterSummary } from './job.type';

// ==================== Status Transition Rules ====================

const ALLOWED_TRANSITIONS: Record<JobStatus, JobStatus[]> = {
  [JobStatus.NEW]: [JobStatus.ASSIGNED],
  [JobStatus.ASSIGNED]: [JobStatus.TRANSCRIBED],
  [JobStatus.TRANSCRIBED]: [JobStatus.REVIEWED],
  [JobStatus.REVIEWED]: [JobStatus.COMPLETED],
  [JobStatus.COMPLETED]: [],
};

@injectable()
export class JobService {
  constructor(@inject(DI_TYPES.PrismaClient) private readonly prisma: PrismaClient) {}

  // ==================== Private Helper Methods ====================

  /**
   * Validates job existence by ID and returns the full record
   * @param id - Job ID to check
   */
  private async ensureJobExists(id: string) {
    const job = await this.prisma.job.findUnique({
      where: { id },
      select: JOB_BASE_SELECT,
    });

    if (!job) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Job not found');
    }

    return job;
  }

  /**
   * Validates reporter existence and returns the record
   * @param id - Reporter ID to check
   */
  private async ensureReporterExists(id: string) {
    const reporter = await this.prisma.reporter.findUnique({ where: { id } });

    if (!reporter) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Reporter not found');
    }

    return reporter;
  }

  /**
   * Validates editor existence and returns the record
   * @param id - Editor ID to check
   */
  private async ensureEditorExists(id: string) {
    const editor = await this.prisma.editor.findUnique({ where: { id } });

    if (!editor) {
      throw new AppError(StatusCodes.NOT_FOUND, 'Editor not found');
    }

    return editor;
  }

  /**
   * Builds Prisma where clause for job filtering
   * @param query - Query parameters for filtering
   * @returns Prisma where clause object
   */
  private buildJobWhereClause(query: GetJobsQuery): Prisma.JobWhereInput {
    const { search, status, location } = query;

    return {
      ...(status && { status: { in: status } }),
      ...(location && { location: { in: location } }),
      ...(search && {
        OR: [
          { caseName: { contains: search, mode: 'insensitive' } },
          { city: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };
  }

  // ==================== Job Queries ====================

  /**
   * Retrieves paginated jobs with filtering and sorting
   * @param query - Query parameters for pagination, filtering and sorting
   * @returns Paginated job list with metadata
   */
  async getJobs(query: GetJobsQuery): Promise<{ jobs: JobResponse[]; pagination: PaginationMeta }> {
    const { page, limit } = normalizePaginationParams(query.page, query.limit);
    const { sortBy, sortOrder } = query;
    const skip = calculateSkip(page, limit);
    const where = this.buildJobWhereClause(query);

    const [total, jobs] = await Promise.all([
      this.prisma.job.count({ where }),
      this.prisma.job.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        select: JOB_BASE_SELECT,
      }),
    ]);

    const pagination = calculatePagination(page, limit, total);

    return { jobs: mapJobsResponse(jobs), pagination };
  }

  /**
   * Retrieves job by ID
   * @param id - Job ID to fetch
   * @returns Job response object
   */
  async getJobById(id: string): Promise<JobResponse> {
    const job = await this.ensureJobExists(id);
    return mapJobResponse(job);
  }

  // ==================== Job Management ====================

  /**
   * Creates new transcription job
   * @param data - Job creation data
   * @returns Created job response
   */
  async createJob(data: CreateJobBody): Promise<JobResponse> {
    const { caseName, duration, location, city } = data;

    const job = await this.prisma.job.create({
      data: {
        caseName,
        duration,
        location,
        city: location === JobLocation.PHYSICAL ? city : null,
        status: JobStatus.NEW,
      },
      select: JOB_BASE_SELECT,
    });

    return mapJobResponse(job);
  }

  /**
   * Updates job status following the allowed transition rules
   * @param id - Job ID to update
   * @param newStatus - Target status
   * @returns Updated job response
   */
  async updateStatus(id: string, newStatus: JobStatus): Promise<JobResponse> {
    const job = await this.ensureJobExists(id);

    const allowedNext = ALLOWED_TRANSITIONS[job.status];
    if (!allowedNext.includes(newStatus)) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        `Cannot transition job from ${job.status} to ${newStatus}`,

      );
    }

    const updated = await this.prisma.job.update({
      where: { id },
      data: { status: newStatus },
      select: JOB_BASE_SELECT,
    });

    return mapJobResponse(updated);
  }

  // ==================== Assignment ====================

  /**
   * Suggests available reporters for a job, preferring same-city matches for physical jobs
   * @param id - Job ID to suggest reporters for
   * @returns List of suggested reporters
   */
  async suggestReporters(id: string): Promise<ReporterSummary[]> {
    const job = await this.ensureJobExists(id);

    if (job.location === JobLocation.PHYSICAL && job.city) {
      const sameCity = await this.prisma.reporter.findMany({
        where: { available: true, city: job.city },
        select: { id: true, name: true, city: true, available: true, ratePerMin: true },
      });

      if (sameCity.length > 0) {
        return sameCity;
      }
    }

    return this.prisma.reporter.findMany({
      where: { available: true },
      select: { id: true, name: true, city: true, available: true, ratePerMin: true },
    });
  }

  /**
   * Assigns a reporter to a job and advances status to ASSIGNED
   * @param id - Job ID to assign
   * @param reporterId - Reporter ID to assign
   * @returns Updated job response
   */
  async assignReporter(id: string, reporterId: string): Promise<JobResponse> {
    const job = await this.ensureJobExists(id);
    await this.ensureReporterExists(reporterId);

    if (job.status !== JobStatus.NEW) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Reporter can only be assigned to jobs with NEW status',

      );
    }

    const updated = await this.prisma.job.update({
      where: { id },
      data: { reporterId, status: JobStatus.ASSIGNED },
      select: JOB_BASE_SELECT,
    });

    return mapJobResponse(updated);
  }

  /**
   * Assigns an editor to a job that has been transcribed
   * @param id - Job ID to assign
   * @param editorId - Editor ID to assign
   * @returns Updated job response
   */
  async assignEditor(id: string, editorId: string): Promise<JobResponse> {
    const job = await this.ensureJobExists(id);
    await this.ensureEditorExists(editorId);

    if (job.status !== JobStatus.TRANSCRIBED) {
      throw new AppError(
        StatusCodes.BAD_REQUEST,
        'Editor can only be assigned to jobs with TRANSCRIBED status',

      );
    }

    const updated = await this.prisma.job.update({
      where: { id },
      data: { editorId },
      select: JOB_BASE_SELECT,
    });

    return mapJobResponse(updated);
  }

  // ==================== Payment ====================

  /**
   * Calculates the payment breakdown for a job
   * @param id - Job ID to calculate payment for
   * @returns Payment breakdown with reporter pay, editor pay, and total
   */
  async calculatePayment(id: string): Promise<PaymentBreakdownResponse> {
    const job = await this.ensureJobExists(id);

    const reporterPay = job.reporter ? job.duration * job.reporter.ratePerMin : 0;
    const editorPay = job.editor ? job.editor.flatFee : 0;

    return {
      jobId: job.id,
      reporterPay,
      editorPay,
      total: reporterPay + editorPay,
    };
  }
}