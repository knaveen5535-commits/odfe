import { Request, Response } from 'express';
import { prisma } from '../index';
import { NotFoundError } from '../utils/errors';

export async function getAll(req: Request, res: Response): Promise<void> {
  const { categoryId, isAvailable, search } = req.query;
  const where: Record<string, unknown> = {};
  if (categoryId) where.categoryId = categoryId;
  if (isAvailable !== undefined) where.isAvailable = isAvailable === 'true';
  if (search) where.name = { contains: search as string };

  const products = await prisma.product.findMany({
    where,
    include: { category: true, tax: true, uom: true },
    orderBy: [{ sequence: 'asc' }, { name: 'asc' }],
  });
  res.json({ success: true, data: products });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const product = await prisma.product.findUnique({
    where: { id: req.params.id },
    include: { category: true, tax: true, uom: true },
  });
  if (!product) throw new NotFoundError('Product');
  res.json({ success: true, data: product });
}

export async function create(req: Request, res: Response): Promise<void> {
  const product = await prisma.product.create({ data: req.body, include: { category: true } });
  res.status(201).json({ success: true, data: product });
}

export async function update(req: Request, res: Response): Promise<void> {
  const product = await prisma.product.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: product });
}

export async function remove(req: Request, res: Response): Promise<void> {
  await prisma.product.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Product deleted' });
}
