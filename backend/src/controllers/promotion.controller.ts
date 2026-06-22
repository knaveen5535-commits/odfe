import { Request, Response } from 'express';
import { prisma } from '../index';
import { NotFoundError } from '../utils/errors';

export async function getAll(req: Request, res: Response): Promise<void> {
  const promotions = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: promotions });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const promotion = await prisma.promotion.findUnique({ where: { id: req.params.id } });
  if (!promotion) throw new NotFoundError('Promotion');
  res.json({ success: true, data: promotion });
}

export async function create(req: Request, res: Response): Promise<void> {
  const promotion = await prisma.promotion.create({ data: req.body });
  res.status(201).json({ success: true, data: promotion });
}

export async function update(req: Request, res: Response): Promise<void> {
  const promotion = await prisma.promotion.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: promotion });
}

export async function remove(req: Request, res: Response): Promise<void> {
  await prisma.promotion.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Promotion deleted' });
}
