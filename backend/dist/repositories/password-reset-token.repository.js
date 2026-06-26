"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.passwordResetTokenRepository = void 0;
const index_1 = require("../index");
exports.passwordResetTokenRepository = {
    create(data) {
        return index_1.prisma.passwordResetToken.create({ data });
    },
    findByToken(token) {
        return index_1.prisma.passwordResetToken.findUnique({ where: { token } });
    },
    markUsed(id) {
        return index_1.prisma.passwordResetToken.update({ where: { id }, data: { usedAt: new Date() } });
    },
};
//# sourceMappingURL=password-reset-token.repository.js.map