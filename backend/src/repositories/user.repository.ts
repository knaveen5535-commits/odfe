import { prisma } from '../index';

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },
  create(data: { email: string; password: string; firstName?: string; lastName?: string; role?: string }) {
    return prisma.user.create({ data } as any);
  },
};
