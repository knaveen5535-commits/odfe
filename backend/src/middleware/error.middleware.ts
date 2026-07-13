import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/errors';

export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      error: err.message,
      code: err.code,
    });
    return;
  }

  if (err instanceof ZodError) {
    const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
    res.status(400).json({
      success: false,
      error: message || 'Validation error',
      code: 'VALIDATION_ERROR',
    });
    return;
  }

  if (err instanceof Prisma.PrismaClientInitializationError) {
    console.error('Database connection error:', err.message);
    res.status(503).json({
      success: false,
      error: 'Database is not available. Please make sure PostgreSQL is running.',
      code: 'DATABASE_UNAVAILABLE',
    });
    return;
  }

  console.error('Unhandled error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
  });
}
