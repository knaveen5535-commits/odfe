import { Request, Response } from 'express';
import { prisma } from '../index';
import { NotFoundError, UnauthorizedError } from '../utils/errors';

export async function getAll(req: Request, res: Response): Promise<void> {
  const { status, sessionId, page = '1', limit = '20' } = req.query;
  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (sessionId) where.sessionId = sessionId;

  const skip = (parseInt(page as string) - 1) * parseInt(limit as string);
  const take = parseInt(limit as string);

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: { orderLines: { include: { product: true } }, employee: true, customer: true, table: true, payments: true },
      orderBy: { createdAt: 'desc' },
      skip,
      take,
    }),
    prisma.order.count({ where }),
  ]);

  res.json({ success: true, data: { orders, total, page: parseInt(page as string), limit: take } });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const order = await prisma.order.findUnique({
    where: { id: req.params.id },
    include: { orderLines: { include: { product: true } }, payments: { include: { method: true } }, employee: true, customer: true, table: true },
  });
  if (!order) throw new NotFoundError('Order');
  res.json({ success: true, data: order });
}

export async function create(req: Request, res: Response): Promise<void> {
  const { items, customerId, tableId, orderType, note, sessionId } = req.body;

  const employee = await prisma.employee.findUnique({ where: { userId: req.user!.userId } });
  if (!employee) throw new UnauthorizedError('No employee profile found for this user');

  const order = await prisma.order.create({
    data: {
      employeeId: employee.id,
      customerId: customerId || null,
      tableId: tableId || null,
      orderType: orderType || 'dine_in',
      note: note || null,
      sessionId: sessionId || null,
      orderRef: `ORD-${Date.now()}`,
      orderLines: {
        create: items.map((item: { productId: string; qty: number; priceUnit: number; discount?: number }) => ({
          productId: item.productId,
          qty: item.qty,
          priceUnit: item.priceUnit,
          discount: item.discount || 0,
          subtotal: item.qty * item.priceUnit * (1 - (item.discount || 0) / 100),
        })),
      },
    },
    include: { orderLines: true },
  });

  await prisma.kitchenOrder.create({
    data: {
      orderId: order.id,
      displayName: `K-${order.orderRef}`,
      status: 'new',
      items: { create: items.map((item: { productId: string; qty: number }) => ({ productId: item.productId, qty: item.qty })) },
    },
  });

  res.status(201).json({ success: true, data: order });
}

export async function updateStatus(req: Request, res: Response): Promise<void> {
  const { status } = req.body;
  const order = await prisma.order.update({ where: { id: req.params.id }, data: { status } });
  res.json({ success: true, data: order });
}

export async function remove(req: Request, res: Response): Promise<void> {
  await prisma.order.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Order deleted' });
}
