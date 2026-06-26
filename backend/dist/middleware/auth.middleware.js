"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = authenticate;
exports.authorize = authorize;
const jwt_1 = require("../utils/jwt");
const errors_1 = require("../utils/errors");
function authenticate(req, _res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new errors_1.UnauthorizedError('No token provided');
    }
    const token = authHeader.split(' ')[1];
    try {
        const payload = (0, jwt_1.verifyToken)(token);
        req.user = payload;
        next();
    }
    catch {
        throw new errors_1.UnauthorizedError('Invalid token');
    }
}
function authorize(...roles) {
    return (req, _res, next) => {
        if (!req.user) {
            throw new errors_1.UnauthorizedError();
        }
        if (!roles.includes(req.user.role)) {
            throw new errors_1.ForbiddenError('Insufficient permissions');
        }
        next();
    };
}
//# sourceMappingURL=auth.middleware.js.map