import { prisma } from '../index';

export const refreshTokenRepository = {
  create(data: { token: string; userId: string; expiresAt: Date }) {
    return prisma.refreshToken.create({ data });
  },
  findByToken(token: string) {
    return prisma.refreshToken.findUnique({ where: { token } });
  },
  revokeUserTokens(userId: string) {
    return prisma.refreshToken.updateMany({
      where: { userId, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  },
};
