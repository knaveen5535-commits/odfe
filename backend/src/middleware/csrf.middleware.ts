import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { AppError } from '../utils/errors';

export function csrfProtection(req: Request, res: Response, next: NextFunction): void {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    if (!req.cookies?.['csrf-token']) {
      const token = crypto.randomBytes(32).toString('hex');
      res.cookie('csrf-token', token, {
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      });
    }
    next();
    return;
  }

  const headerToken = req.headers['x-csrf-token'] as string;
  const cookieToken = req.cookies?.['csrf-token'];

  if (!headerToken || !cookieToken || headerToken !== cookieToken) {
    throw new AppError(403, 'CSRF token mismatch', 'CSRF_ERROR');
  }

  next();
}
