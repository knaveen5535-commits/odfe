import { prisma } from '../index';

export const passwordResetTokenRepository = {
  create(data: { token: string; userId: string; expiresAt: Date }) {
    return prisma.passwordResetToken.create({ data });
  },
  findByToken(token: string) {
    return prisma.passwordResetToken.findUnique({ where: { token } });
  },
  markUsed(id: string) {
    return prisma.passwordResetToken.update({ where: { id }, data: { usedAt: new Date() } });
  },
};
