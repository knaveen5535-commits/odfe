import { Request, Response } from 'express';
import { prisma } from '../index';
import { NotFoundError } from '../utils/errors';

export async function getAll(req: Request, res: Response): Promise<void> {
  const { search } = req.query;
  const where = search ? { OR: [{ name: { contains: search as string } }, { phone: { contains: search as string } }] } : {};
  const customers = await prisma.customer.findMany({ where, orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: customers });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const customer = await prisma.customer.findUnique({
    where: { id: req.params.id },
    include: { orders: true, loyaltyPointsRel: true },
  });
  if (!customer) throw new NotFoundError('Customer');
  res.json({ success: true, data: customer });
}

export async function create(req: Request, res: Response): Promise<void> {
  const customer = await prisma.customer.create({ data: req.body });
  res.status(201).json({ success: true, data: customer });
}

export async function update(req: Request, res: Response): Promise<void> {
  const customer = await prisma.customer.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: customer });
}

export async function remove(req: Request, res: Response): Promise<void> {
  await prisma.customer.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Customer deleted' });
}
