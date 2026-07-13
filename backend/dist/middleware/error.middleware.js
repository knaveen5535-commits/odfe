"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
const zod_1 = require("zod");
const client_1 = require("@prisma/client");
const errors_1 = require("../utils/errors");
function errorHandler(err, _req, res, _next) {
    if (err instanceof errors_1.AppError) {
        res.status(err.statusCode).json({
            success: false,
            error: err.message,
            code: err.code,
        });
        return;
    }
    if (err instanceof zod_1.ZodError) {
        const message = err.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
        res.status(400).json({
            success: false,
            error: message || 'Validation error',
            code: 'VALIDATION_ERROR',
        });
        return;
    }
    if (err instanceof client_1.Prisma.PrismaClientInitializationError) {
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
//# sourceMappingURL=error.middleware.js.map