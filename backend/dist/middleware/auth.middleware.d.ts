import { Request, Response, NextFunction } from 'express';
import { TokenPayload } from '../utils/jwt';
declare global {
    namespace Express {
        interface Request {
            user?: TokenPayload;
        }
    }
}
export declare function authenticate(req: Request, _res: Response, next: NextFunction): void;
export declare function authorize(...roles: string[]): (req: Request, _res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map