"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogRepository = void 0;
const index_1 = require("../index");
exports.auditLogRepository = {
    create(data) {
        return index_1.prisma.auditLog.create({ data });
    },
    findByEntity(entity, entityId) {
        return index_1.prisma.auditLog.findMany({ where: { entity, entityId }, orderBy: { createdAt: 'desc' }, take: 50 });
    },
};
//# sourceMappingURL=audit-log.repository.js.map