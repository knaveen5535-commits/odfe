"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validate = validate;
const zod_1 = require("zod");
const errors_1 = require("../utils/errors");
function validate(schema) {
    return (req, _res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                const message = error.errors.map((e) => `${e.path.join('.')}: ${e.message}`).join(', ');
                throw new errors_1.ValidationError(message);
            }
            throw error;
        }
    };
}
//# sourceMappingURL=validation.middleware.js.map