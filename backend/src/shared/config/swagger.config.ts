import { Options } from 'swagger-jsdoc';
import { env } from './environment.config';

export const swaggerConfig: Options = {
  definition: {
    openapi: '3.0.3',
    info: {
      title: 'Court Reporting System API',
      version: '1.0.0',
      description: `
## Overview
This API provides endpoints for managing court reporting jobs, reporters, and editors. It allows clients to create, read, update, and delete resources related to court reporting.

Common HTTP status codes:
- **400**: Bad Request - Invalid input data
- **401**: Unauthorized - Missing or invalid authentication
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource not found
- **409**: Conflict - Resource already exists
- **422**: Unprocessable Entity - Validation errors
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error - Server error
      `.trim(),
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: `http://localhost:${env.app.port}`,
        description: 'Development server',
      },
      {
        url: 'https://staging-api.example.com',
        description: 'Staging server',
      },
      {
        url: 'https://api.example.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your access token (without "Bearer" prefix)',
        },
        CookieAuth: {
          type: 'apiKey',
          in: 'cookie',
          name: 'refreshToken',
          description: 'Refresh token stored in HTTP-only cookie (automatically sent by browser)',
        },
      },
      schemas: {}, // Will be populated by Zod schemas
    },
    security: [
      {
        BearerAuth: [],
      },
    ],
  },
  apis: [
    './src/modules/**/*.route.ts',
    './src/core/app.ts',
  ],
};
