import type { ErrorDetail } from '@/shared/types/response.type';

/**
 * Custom error class with error code support
 *
 */
export class AppError extends Error {
  public readonly details?: ErrorDetail[];

  constructor(
    public statusCode: number,
    public message: string,
    details?: ErrorDetail[],
    public isOperational = true
  ) {
    super(message);
    this.name = 'AppError';
    this.details = details;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
