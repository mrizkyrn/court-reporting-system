import { Response } from 'express';

import { env } from '@/shared/config/environment.config';
import type { ErrorDetail, ErrorResponse, PaginationMeta, SuccessResponse } from '@/shared/types/response.type';

/**
 * Send a standardized success response
 * @param res - Express response object
 * @param statusCode - HTTP status code
 * @param message - Success message
 * @param data - Response data (optional)
 */
export const sendSuccess = <T = any>(
  res: Response,
  statusCode: number,
  message: string,
  data?: T
): Response<SuccessResponse<T>> => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    ...(data !== undefined && { data }),
  };

  return res.status(statusCode).json(response);
};

/**
 * Send a standardized success response with pagination
 * @param res - Express response object
 * @param statusCode - HTTP status code
 * @param message - Success message
 * @param data - Response data
 * @param pagination - Pagination metadata
 */
export const sendSuccessWithPagination = <T = any>(
  res: Response,
  statusCode: number,
  message: string,
  data: T,
  pagination: PaginationMeta
): Response<SuccessResponse<T>> => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    data,
    pagination,
  };

  return res.status(statusCode).json(response);
};

/**
 * Send a standardized error response
 * @param res - Express response object
 * @param statusCode - HTTP status code
 * @param message - Error message
 * @param details - Array of error details (optional)
 * @param stack - Error stack trace (optional, included only in development)
 * @returns Express response with error details
 */
export const sendErrorResponse = (
  res: Response,
  statusCode: number,
  message: string,
  details?: ErrorDetail[],
  stack?: string
): Response<ErrorResponse> => {
  const response: ErrorResponse = {
    success: false,
    message,
    error: {
      ...(details && details.length > 0 && { details }),
      ...(env.app.isDevelopment && stack && { stack }),
    },
  };

  return res.status(statusCode).json(response);
};
