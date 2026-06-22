import { Request, Response } from 'express';
import { prisma } from '../index';
import { NotFoundError } from '../utils/errors';

export async function getAll(req: Request, res: Response): Promise<void> {
  const coupons = await prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  res.json({ success: true, data: coupons });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const coupon = await prisma.coupon.findUnique({ where: { id: req.params.id } });
  if (!coupon) throw new NotFoundError('Coupon');
  res.json({ success: true, data: coupon });
}

export async function create(req: Request, res: Response): Promise<void> {
  const coupon = await prisma.coupon.create({ data: req.body });
  res.status(201).json({ success: true, data: coupon });
}

export async function update(req: Request, res: Response): Promise<void> {
  const coupon = await prisma.coupon.update({ where: { id: req.params.id }, data: req.body });
  res.json({ success: true, data: coupon });
}

export async function remove(req: Request, res: Response): Promise<void> {
  await prisma.coupon.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Coupon deleted' });
}

export async function validate(req: Request, res: Response): Promise<void> {
  const { code, orderTotal } = req.body;
  const coupon = await prisma.coupon.findUnique({ where: { code } });
  if (!coupon) throw new NotFoundError('Coupon');
  const now = new Date();
  const isValid = coupon.isActive && now >= coupon.validFrom && now <= coupon.validUntil &&
    (coupon.usageLimit === 0 || coupon.usageCount < coupon.usageLimit) &&
    orderTotal >= coupon.minimumOrder;
  res.json({ success: true, data: { valid: isValid, coupon } });
}
