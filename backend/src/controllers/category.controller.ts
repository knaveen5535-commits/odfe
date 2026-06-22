import { Request, Response } from 'express';
import { prisma } from '../index';
import { NotFoundError } from '../utils/errors';

export async function getAll(req: Request, res: Response): Promise<void> {
  const categories = await prisma.category.findMany({ include: { children: true, _count: { select: { products: true } } } });
  res.json({ success: true, data: categories });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const category = await prisma.category.findUnique({
    where: { id: req.params.id },
    include: { products: true, children: true },
  });
  if (!category) throw new NotFoundError('Category');
  res.json({ success: true, data: category });
}

export async function create(req: Request, res: Response): Promise<void> {
  const category = await prisma.category.create({ data: req.body });
  res.status(201).json({ success: true, data: category });
}

export async function update(req: Request, res: Response): Promise<void> {
  const category = await prisma.category.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: category });
}

export async function remove(req: Request, res: Response): Promise<void> {
  await prisma.category.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Category deleted' });
}
