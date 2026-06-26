"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeInput = sanitizeInput;
const errors_1 = require("../utils/errors");
const XSS_PATTERNS = /[<>"'%;()&+]/;
function sanitizeInput(req, _res, next) {
    const sanitize = (obj) => {
        for (const key in obj) {
            if (typeof obj[key] === 'string') {
                const value = obj[key];
                if (XSS_PATTERNS.test(value)) {
                    throw new errors_1.AppError(400, `Invalid characters in field: ${key}`, 'SANITIZATION_ERROR');
                }
            }
            else if (typeof obj[key] === 'object' && obj[key] !== null) {
                sanitize(obj[key]);
            }
        }
    };
    if (req.body)
        sanitize(req.body);
    if (req.query)
        sanitize(req.query);
    if (req.params)
        sanitize(req.params);
    next();
}
//# sourceMappingURL=sanitize.middleware.js.map