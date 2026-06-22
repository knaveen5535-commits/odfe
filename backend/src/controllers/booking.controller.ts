import { Request, Response } from 'express';
import { prisma } from '../index';
import { NotFoundError } from '../utils/errors';

export async function getAll(req: Request, res: Response): Promise<void> {
  const bookings = await prisma.booking.findMany({ include: { customer: true, table: true } });
  res.json({ success: true, data: bookings });
}

export async function getById(req: Request, res: Response): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: req.params.id },
    include: { customer: true, table: true },
  });
  if (!booking) throw new NotFoundError('Booking');
  res.json({ success: true, data: booking });
}

export async function create(req: Request, res: Response): Promise<void> {
  const booking = await prisma.booking.create({ data: req.body });
  res.status(201).json({ success: true, data: booking });
}

export async function update(req: Request, res: Response): Promise<void> {
  const booking = await prisma.booking.update({
    where: { id: req.params.id },
    data: req.body,
  });
  res.json({ success: true, data: booking });
}

export async function remove(req: Request, res: Response): Promise<void> {
  await prisma.booking.delete({ where: { id: req.params.id } });
  res.json({ success: true, message: 'Booking deleted' });
}
