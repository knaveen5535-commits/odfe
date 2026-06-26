import { Request, Response } from 'express';
import { prisma } from '../index';
import { NotFoundError } from '../utils/errors';

export async function getAll(_req: Request, res: Response): Promise<void> {
  const employees = await prisma.employee.findMany({ include: { role: true, user: { select: { email: true } } } });
  res.json({ success: true, data: employees });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const employee = await prisma.employee.findUnique({
    where: { id: req.params.id },
    include: { role: true, user: true, orders: { take: 10, orderBy: { createdAt: 'desc' } } },
  });
  if (!employee) throw new NotFoundError('Employee');
  res.json({ success: true, data: employee });
}

export async function create(req: Request, res: Response): Promise<void> {
  const employee = await prisma.employee.create({ data: req.body });
  res.status(201).json({ success: true, data: employee });
}

export async function update(req: Request, res: Response): Promise<void> {
  const employee = await prisma.employee.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: employee });
}

export async function remove(req: Request, res: Response): Promise<void> {
  await prisma.employee.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Employee deleted' });
}
