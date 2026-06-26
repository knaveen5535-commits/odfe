import { Request, Response } from 'express';
import { prisma } from '../index';
import { NotFoundError } from '../utils/errors';

export async function getAll(_req: Request, res: Response): Promise<void> {
  const payments = await prisma.payment.findMany({
    include: { order: true, method: true },
    orderBy: { paymentDate: 'desc' },
  });
  res.json({ success: true, data: payments });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const payment = await prisma.payment.findUnique({
    where: { id: req.params.id },
    include: { order: { include: { orderLines: true } }, method: true },
  });
  if (!payment) throw new NotFoundError('Payment');
  res.json({ success: true, data: payment });
}

export async function create(req: Request, res: Response): Promise<void> {
  const payment = await prisma.payment.create({
    data: {
      ...req.body,
      paymentRef: `PAY-${Date.now()}`,
    },
    include: { method: true },
  });
  await prisma.order.update({ where: { id: req.body.orderId }, data: { status: 'PAID' } });
  res.status(201).json({ success: true, data: payment });
}

export async function refund(req: Request, res: Response): Promise<void> {
  const payment = await prisma.payment.update({
    where: { id: req.params.id },
    data: { status: 'REFUNDED' },
  });
  res.json({ success: true, data: payment });
}

export async function getMethods(_req: Request, res: Response): Promise<void> {
  const methods = await prisma.paymentMethod.findMany({ where: { isActive: true }, orderBy: { sequence: 'asc' } });
  res.json({ success: true, data: methods });
}
