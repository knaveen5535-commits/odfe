export declare const passwordResetTokenRepository: {
    create(data: {
        token: string;
        userId: string;
        expiresAt: Date;
    }): import(".prisma/client").Prisma.Prisma__PasswordResetTokenClient<{
        token: string;
        id: string;
        createdAt: Date;
        expiresAt: Date;
        userId: string;
        usedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
    findByToken(token: string): import(".prisma/client").Prisma.Prisma__PasswordResetTokenClient<{
        token: string;
        id: string;
        createdAt: Date;
        expiresAt: Date;
        userId: string;
        usedAt: Date | null;
    } | null, null, import("@prisma/client/runtime/library").DefaultArgs>;
    markUsed(id: string): import(".prisma/client").Prisma.Prisma__PasswordResetTokenClient<{
        token: string;
        id: string;
        createdAt: Date;
        expiresAt: Date;
        userId: string;
        usedAt: Date | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs>;
};
//# sourceMappingURL=password-reset-token.repository.d.ts.map