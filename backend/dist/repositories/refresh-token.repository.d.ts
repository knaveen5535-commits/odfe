export declare const refreshTokenRepository: {
    create(data: {
        token: string;
        userId: string;
        expiresAt: Date;
    }): import(".prisma/client").Prisma.Prisma__RefreshTokenClient<{
        token: string;
        id: string;
        createdAt: Date;
        expiresAt: Date;
        revokedAt: Date | null;
        userId: string;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findByToken(token: string): import(".prisma/client").Prisma.Prisma__RefreshTokenClient<{
        token: string;
        id: string;
        createdAt: Date;
        expiresAt: Date;
        revokedAt: Date | null;
        userId: string;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    revokeUserTokens(userId: string): import(".prisma/client").Prisma.PrismaPromise<import(".prisma/client").Prisma.BatchPayload>;
};
//# sourceMappingURL=refresh-token.repository.d.ts.map