import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';

const XSS_PATTERNS = /[<>"'%;()&+]/;

export function sanitizeInput(req: Request, _res: Response, next: NextFunction): void {
  const sanitize = (obj: Record<string, unknown>): void => {
    for (const key in obj) {
      if (typeof obj[key] === 'string') {
        const value = obj[key] as string;
        if (XSS_PATTERNS.test(value)) {
          throw new AppError(400, `Invalid characters in field: ${key}`, 'SANITIZATION_ERROR');
        }
      } else if (typeof obj[key] === 'object' && obj[key] !== null) {
        sanitize(obj[key] as Record<string, unknown>);
      }
    }
  };

  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query as Record<string, unknown>);
  if (req.params) sanitize(req.params as Record<string, unknown>);

  next();
}
