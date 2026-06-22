import { Request, Response } from 'express';
import { prisma } from '../index';
import { NotFoundError } from '../utils/errors';

export async function getOrders(req: Request, res: Response): Promise<void> {
  const statusFilter = (req.query.status as string)?.split(',') || ['new', 'preparing', 'ready'];
  const orders = await prisma.kitchenOrder.findMany({
    where: { status: { in: statusFilter } },
    include: { items: { include: { product: { select: { name: true } } } } },
    orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
  });
  res.json({ success: true, data: orders });
}

export async function updateStatus(req: Request, res: Response): Promise<void> {
  const { status } = req.body;
  const validTransitions: Record<string, string[]> = {
    new: ['preparing', 'cancelled'],
    preparing: ['ready', 'cancelled'],
    ready: ['served'],
  };

  const order = await prisma.kitchenOrder.findUnique({ where: { id: req.params.id } });
  if (!order) throw new NotFoundError('Kitchen order');

  const allowed = validTransitions[order.status] || [];
  if (!allowed.includes(status)) {
    res.status(400).json({ success: false, error: `Invalid transition from ${order.status} to ${status}` });
    return;
  }

  const updated = await prisma.kitchenOrder.update({ where: { id: req.params.id }, data: { status } });
  res.json({ success: true, data: updated });
}

export async function updateItemStatus(req: Request, res: Response): Promise<void> {
  const { status } = req.body;
  const item = await prisma.kitchenItem.update({ where: { id: req.params.itemId }, data: { status } });
  res.json({ success: true, data: item });
}
