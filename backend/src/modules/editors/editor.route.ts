import { Router } from 'express';

import { container } from '@/core/container';
import { DI_TYPES } from '@/shared/constants';
import { validate } from '@/shared/middleware/validation.middleware';
import { asyncHandler } from '@/shared/utils/async-handler.util';
import { EditorController } from './editor.controller';
import { createEditorSchema, getEditorsQuerySchema, updateEditorSchema } from './editor.schema';
import type { EditorService } from './editor.service';

const router = Router();

// Resolve controller from DI container
const editorService = container.resolve<EditorService>(DI_TYPES.EditorService);
const editorController = new EditorController(editorService);

// ==================== Editor Queries ====================

/**
 * @openapi
 * /api/editors:
 *   get:
 *     tags:
 *       - Editors
 *     summary: Get paginated list of editors
 *     description: Retrieve a paginated list of editors with optional filtering and sorting.
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
 *         description: Search by name
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [createdAt, updatedAt, name, flatFee]
 *           default: createdAt
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *           default: desc
 *     responses:
 *       200:
 *         description: Editors retrieved successfully
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
  validate({ query: getEditorsQuerySchema }),
  asyncHandler(editorController.getEditors.bind(editorController))
);

/**
 * @openapi
 * /api/editors/{id}:
 *   get:
 *     tags:
 *       - Editors
 *     summary: Get editor by ID
 *     description: Retrieve a specific editor by their ID.
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
 *         description: Editor retrieved successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Editor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:id', asyncHandler(editorController.getEditorById.bind(editorController)));

// ==================== Editor Management ====================

/**
 * @openapi
 * /api/editors:
 *   post:
 *     tags:
 *       - Editors
 *     summary: Create new editor
 *     description: Create a new editor with name and flat fee.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateEditorBody'
 *     responses:
 *       201:
 *         description: Editor created successfully
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
  validate({ body: createEditorSchema }),
  asyncHandler(editorController.createEditor.bind(editorController))
);

/**
 * @openapi
 * /api/editors/{id}:
 *   patch:
 *     tags:
 *       - Editors
 *     summary: Update editor by ID
 *     description: Update an editor's name or flat fee.
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
 *             $ref: '#/components/schemas/UpdateEditorBody'
 *     responses:
 *       200:
 *         description: Editor updated successfully
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
 *         description: Editor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch(
  '/:id',
  validate({ body: updateEditorSchema }),
  asyncHandler(editorController.updateEditor.bind(editorController))
);

/**
 * @openapi
 * /api/editors/{id}:
 *   delete:
 *     tags:
 *       - Editors
 *     summary: Delete editor by ID
 *     description: Permanently delete an editor from the system.
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
 *         description: Editor deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Editor not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/:id', asyncHandler(editorController.deleteEditor.bind(editorController)));

export default router;