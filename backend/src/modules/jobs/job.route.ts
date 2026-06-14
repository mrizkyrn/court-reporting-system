import { Router } from 'express';

import { container } from '@/core/container';
import { DI_TYPES } from '@/shared/constants';
import { validate } from '@/shared/middleware/validation.middleware';
import { asyncHandler } from '@/shared/utils/async-handler.util';
import { JobController } from './job.controller';
import {
  assignEditorSchema,
  assignReporterSchema,
  createJobSchema,
  getJobsQuerySchema,
  updateJobStatusSchema,
} from './job.schema';
import type { JobService } from './job.service';

const router = Router();

// Resolve controller from DI container
const jobService = container.resolve<JobService>(DI_TYPES.JobService);
const jobController = new JobController(jobService);

// ==================== Job Queries ====================

/**
 * @openapi
 * /api/jobs:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get paginated list of jobs
 *     description: Retrieve a paginated list of transcription jobs with optional filtering and sorting.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by case name or city
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, caseName, duration]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *         description: Filter by status (comma-separated)
 *         example: NEW,ASSIGNED
 *       - in: query
 *         name: location
 *         schema:
 *           type: string
 *         description: Filter by location type (comma-separated)
 *         example: PHYSICAL,REMOTE
 *     responses:
 *       200:
 *         description: Jobs retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaginatedResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/',
  validate({ query: getJobsQuerySchema }),
  asyncHandler(jobController.getJobs.bind(jobController))
);

/**
 * @openapi
 * /api/jobs/{id}:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get job by ID
 *     description: Retrieve a specific transcription job by its ID, including assigned reporter and editor.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: clxxx1234567890
 *     responses:
 *       200:
 *         description: Job retrieved successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', asyncHandler(jobController.getJobById.bind(jobController)));

// ==================== Job Management ====================

/**
 * @openapi
 * /api/jobs:
 *   post:
 *     tags:
 *       - Jobs
 *     summary: Create new transcription job
 *     description: Create a new job with case name, duration, and location. City is required for physical jobs.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateJobBody'
 *     responses:
 *       201:
 *         description: Job created successfully
 *       400:
 *         description: Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post(
  '/',
  validate({ body: createJobSchema }),
  asyncHandler(jobController.createJob.bind(jobController))
);

/**
 * @openapi
 * /api/jobs/{id}/status:
 *   patch:
 *     tags:
 *       - Jobs
 *     summary: Update job status
 *     description: Transition the job to a new status following the allowed workflow order (NEW -> ASSIGNED -> TRANSCRIBED -> REVIEWED -> COMPLETED).
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: clxxx1234567890
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateJobStatusBody'
 *     responses:
 *       200:
 *         description: Job status updated successfully
 *       400:
 *         description: Invalid status transition
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  '/:id/status',
  validate({ body: updateJobStatusSchema }),
  asyncHandler(jobController.updateStatus.bind(jobController))
);

// ==================== Assignment ====================

/**
 * @openapi
 * /api/jobs/{id}/suggested-reporters:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Get suggested reporters for a job
 *     description: Returns available reporters, preferring those in the same city for physical jobs.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: clxxx1234567890
 *     responses:
 *       200:
 *         description: Suggested reporters retrieved successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get(
  '/:id/suggested-reporters',
  asyncHandler(jobController.getSuggestedReporters.bind(jobController))
);

/**
 * @openapi
 * /api/jobs/{id}/assign-reporter:
 *   patch:
 *     tags:
 *       - Jobs
 *     summary: Assign a reporter to a job
 *     description: Assigns the given reporter to the job and advances the status from NEW to ASSIGNED.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: clxxx1234567890
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignReporterBody'
 *     responses:
 *       200:
 *         description: Reporter assigned successfully
 *       400:
 *         description: Job is not in NEW status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job or reporter not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  '/:id/assign-reporter',
  validate({ body: assignReporterSchema }),
  asyncHandler(jobController.assignReporter.bind(jobController))
);

/**
 * @openapi
 * /api/jobs/{id}/assign-editor:
 *   patch:
 *     tags:
 *       - Jobs
 *     summary: Assign an editor to a job
 *     description: Assigns the given editor to the job. Only allowed when the job status is TRANSCRIBED.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: clxxx1234567890
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AssignEditorBody'
 *     responses:
 *       200:
 *         description: Editor assigned successfully
 *       400:
 *         description: Job is not in TRANSCRIBED status
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job or editor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  '/:id/assign-editor',
  validate({ body: assignEditorSchema }),
  asyncHandler(jobController.assignEditor.bind(jobController))
);

// ==================== Payment ====================

/**
 * @openapi
 * /api/jobs/{id}/payment:
 *   get:
 *     tags:
 *       - Jobs
 *     summary: Calculate job payment breakdown
 *     description: Returns the reporter pay, editor pay, and total payout for the job.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: clxxx1234567890
 *     responses:
 *       200:
 *         description: Payment calculated successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Job not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id/payment', asyncHandler(jobController.calculatePayment.bind(jobController)));

export default router;