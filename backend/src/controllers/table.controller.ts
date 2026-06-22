import { Request, Response } from 'express';
import { prisma } from '../index';
import { NotFoundError } from '../utils/errors';

export async function getAll(req: Request, res: Response): Promise<void> {
  const { floorId } = req.query;
  const where = floorId ? { floorId: floorId as string } : {};
  const tables = await prisma.table.findMany({
    where,
    include: { floor: true, currentOrder: true },
    orderBy: [{ floorId: 'asc' }, { sequence: 'asc' }],
  });
  res.json({ success: true, data: tables });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const table = await prisma.table.findUnique({
    where: { id: req.params.id },
    include: { floor: true, currentOrder: { include: { orderLines: { include: { product: true } } } } },
  });
  if (!table) throw new NotFoundError('Table');
  res.json({ success: true, data: table });
}

export async function updateStatus(req: Request, res: Response): Promise<void> {
  const table = await prisma.table.update({ where: { id: req.params.id }, data: { status: req.body.status } });
  res.json({ success: true, data: table });
}
