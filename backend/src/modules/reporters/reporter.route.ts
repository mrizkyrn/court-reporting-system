import { Router } from 'express';

import { container } from '@/core/container';
import { DI_TYPES } from '@/shared/constants';
import { validate } from '@/shared/middleware/validation.middleware';
import { asyncHandler } from '@/shared/utils/async-handler.util';
import { ReporterController } from './reporter.controller';
import { createReporterSchema, getReportersQuerySchema, updateReporterSchema } from './reporter.schema';
import type { ReporterService } from './reporter.service';

const router = Router();

// Resolve controller from DI container
const reporterService = container.resolve<ReporterService>(DI_TYPES.ReporterService);
const reporterController = new ReporterController(reporterService);

// ==================== Reporter Queries ====================

/**
 * @openapi
 * /api/reporters:
 *   get:
 *     tags:
 *       - Reporters
 *     summary: Get paginated list of reporters
 *     description: Retrieve a paginated list of court reporters with optional filtering and sorting.
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
 *         description: Search by name or city
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, name, city]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *       - in: query
 *         name: available
 *         schema:
 *           type: string
 *           enum: [true, false]
 *         description: Filter by availability status
 *     responses:
 *       200:
 *         description: Reporters retrieved successfully
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
  validate({ query: getReportersQuerySchema }),
  asyncHandler(reporterController.getReporters.bind(reporterController))
);

/**
 * @openapi
 * /api/reporters/{id}:
 *   get:
 *     tags:
 *       - Reporters
 *     summary: Get reporter by ID
 *     description: Retrieve a specific court reporter by their ID.
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
 *         description: Reporter retrieved successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Reporter not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', asyncHandler(reporterController.getReporterById.bind(reporterController)));

// ==================== Reporter Management ====================

/**
 * @openapi
 * /api/reporters:
 *   post:
 *     tags:
 *       - Reporters
 *     summary: Create new reporter
 *     description: Create a new court reporter with name, city, availability, and pay rate.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateReporterBody'
 *     responses:
 *       201:
 *         description: Reporter created successfully
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
  validate({ body: createReporterSchema }),
  asyncHandler(reporterController.createReporter.bind(reporterController))
);

/**
 * @openapi
 * /api/reporters/{id}:
 *   patch:
 *     tags:
 *       - Reporters
 *     summary: Update reporter by ID
 *     description: Update a reporter's information including availability and pay rate.
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
 *             $ref: '#/components/schemas/UpdateReporterBody'
 *     responses:
 *       200:
 *         description: Reporter updated successfully
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
 *       404:
 *         description: Reporter not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  '/:id',
  validate({ body: updateReporterSchema }),
  asyncHandler(reporterController.updateReporter.bind(reporterController))
);

/**
 * @openapi
 * /api/reporters/{id}:
 *   delete:
 *     tags:
 *       - Reporters
 *     summary: Delete reporter by ID
 *     description: Permanently delete a reporter from the system.
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
 *         description: Reporter deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Reporter not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', asyncHandler(reporterController.deleteReporter.bind(reporterController)));

export default router;