import { RoleType } from '@prisma/client';
import { Request, Response } from 'express';
import { z } from 'zod';
import * as authService from '../services/auth.service';
import { prisma } from '../index';
import { AppError } from '../utils/errors';

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  role: z.nativeEnum(RoleType).optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function register(req: Request, res: Response): Promise<void> {
  const data = registerSchema.parse(req.body);
  const result = await authService.register({ ...data, role: data.role || RoleType.ADMIN });
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.status(201).json({ success: true, data: { accessToken: result.accessToken, user: result.user } });
}

export async function login(req: Request, res: Response): Promise<void> {
  const data = loginSchema.parse(req.body);
  const result = await authService.login(data.email, data.password);
  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
  res.json({ success: true, data: { accessToken: result.accessToken, user: result.user } });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const refreshToken = req.cookies?.refreshToken;
  if (refreshToken) {
    await prisma.refreshToken.updateMany({
      where: { token: refreshToken, revokedAt: null },
      data: { revokedAt: new Date() },
    });
  }
  res.clearCookie('refreshToken');
  res.json({ success: true, message: 'Logged out' });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.refreshToken || req.body.refreshToken;
  if (!token) throw new AppError(401, 'Refresh token required');
  const result = await authService.refreshToken(token);
  res.json({ success: true, data: result });
}

export async function requestPasswordReset(req: Request, res: Response): Promise<void> {
  const { email } = req.body;
  await authService.requestPasswordReset(email);
  res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  const { token, password } = req.body;
  await authService.resetPassword(token, password);
  res.json({ success: true, message: 'Password reset successfully' });
}

const roleDepartmentMap: Record<string, string> = {
  ADMIN: 'Management',
  CASHIER: 'Cashier',
  WAITER: 'Floor',
  KITCHEN_STAFF: 'Kitchen',
  BILLING: 'Billing',
};

export async function getProfile(req: Request, res: Response): Promise<void> {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.userId },
    select: { id: true, email: true, firstName: true, lastName: true, role: true },
  });
  if (!user) throw new AppError(404, 'User not found');
  res.json({
    success: true,
    data: { ...user, department: roleDepartmentMap[user.role] || '' },
  });
}
