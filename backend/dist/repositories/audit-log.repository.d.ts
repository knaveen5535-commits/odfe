export declare const auditLogRepository: {
    create(data: {
        userId?: string;
        action: string;
        entity: string;
        entityId?: string;
        oldValue?: string;
        newValue?: string;
        ipAddress?: string;
    }): import(".prisma/client").Prisma.Prisma__AuditLogClient<{
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        oldValue: string | null;
        newValue: string | null;
        ipAddress: string | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findByEntity(entity: string, entityId: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        userId: string | null;
        action: string;
        entity: string;
        entityId: string | null;
        oldValue: string | null;
        newValue: string | null;
        ipAddress: string | null;
    }[]>;
};
//# sourceMappingURL=audit-log.repository.d.ts.map