"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.csrfProtection = csrfProtection;
const crypto_1 = __importDefault(require("crypto"));
const errors_1 = require("../utils/errors");
function csrfProtection(req, res, next) {
    if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
        if (!req.cookies?.['csrf-token']) {
            const token = crypto_1.default.randomBytes(32).toString('hex');
            res.cookie('csrf-token', token, {
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV === 'production',
            });
        }
        next();
        return;
    }
    const headerToken = req.headers['x-csrf-token'];
    const cookieToken = req.cookies?.['csrf-token'];
    if (!headerToken || !cookieToken || headerToken !== cookieToken) {
        throw new errors_1.AppError(403, 'CSRF token mismatch', 'CSRF_ERROR');
    }
    next();
}
//# sourceMappingURL=csrf.middleware.js.map