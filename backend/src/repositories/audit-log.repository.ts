import { prisma } from '../index';

export const auditLogRepository = {
  create(data: { userId?: string; action: string; entity: string; entityId?: string; oldValue?: string; newValue?: string; ipAddress?: string }) {
    return prisma.auditLog.create({ data });
  },
  findByEntity(entity: string, entityId: string) {
    return prisma.auditLog.findMany({ where: { entity, entityId }, orderBy: { createdAt: 'desc' }, take: 50 });
  },
};
