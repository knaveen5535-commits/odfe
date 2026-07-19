import { Prisma, RoleType } from '@prisma/client';
import { prisma } from '../index';

export const userRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },
  create(data: { email: string; password: string; firstName?: string; lastName?: string; role?: RoleType }) {
    return prisma.user.create({ data });
  },
};
