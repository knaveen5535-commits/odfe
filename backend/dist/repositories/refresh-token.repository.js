"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenRepository = void 0;
const index_1 = require("../index");
exports.refreshTokenRepository = {
    create(data) {
        return index_1.prisma.refreshToken.create({ data });
    },
    findByToken(token) {
        return index_1.prisma.refreshToken.findUnique({ where: { token } });
    },
    revokeUserTokens(userId) {
        return index_1.prisma.refreshToken.updateMany({
            where: { userId, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    },
};
//# sourceMappingURL=refresh-token.repository.js.map