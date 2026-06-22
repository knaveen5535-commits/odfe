import { hashPassword, comparePassword } from '../utils/password';
import { generateAccessToken, generateRefreshToken, verifyToken, TokenPayload } from '../utils/jwt';
import { generateToken } from '../utils/crypto';
import { userRepository } from '../repositories/user.repository';
import { refreshTokenRepository } from '../repositories/refresh-token.repository';
import { passwordResetTokenRepository } from '../repositories/password-reset-token.repository';
import { AppError, UnauthorizedError, ConflictError } from '../utils/errors';

interface RegisterParams {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export async function register(params: RegisterParams) {
  const existing = await userRepository.findByEmail(params.email);
  if (existing) throw new ConflictError('Email already registered');

  const hashedPassword = await hashPassword(params.password);
  const user = await userRepository.create({
    email: params.email,
    password: hashedPassword,
    firstName: params.firstName,
    lastName: params.lastName,
  });

  const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await refreshTokenRepository.create({ token: refreshToken, userId: user.id, expiresAt });

  return {
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    accessToken,
    refreshToken,
  };
}

export async function login(email: string, password: string) {
  const user = await userRepository.findByEmail(email);
  if (!user) throw new UnauthorizedError('Invalid credentials');

  const isValid = await comparePassword(password, user.password);
  if (!isValid) throw new UnauthorizedError('Invalid credentials');

  const payload: TokenPayload = { userId: user.id, email: user.email, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await refreshTokenRepository.create({ token: refreshToken, userId: user.id, expiresAt });

  return {
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName, role: user.role },
    accessToken,
    refreshToken,
  };
}

export async function refreshToken(token: string) {
  const storedToken = await refreshTokenRepository.findByToken(token);
  if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
    if (storedToken) await refreshTokenRepository.revokeUserTokens(storedToken.userId);
    throw new UnauthorizedError('Invalid or expired refresh token');
  }

  let payload: TokenPayload;
  try {
    payload = verifyToken(token);
  } catch {
    await refreshTokenRepository.revokeUserTokens(storedToken.userId);
    throw new UnauthorizedError('Invalid refresh token');
  }

  await refreshTokenRepository.revokeUserTokens(storedToken.userId);

  const newPayload: TokenPayload = { userId: payload.userId, email: payload.email, role: payload.role };
  const newAccessToken = generateAccessToken(newPayload);
  const newRefreshToken = generateRefreshToken(newPayload);

  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  await refreshTokenRepository.create({ token: newRefreshToken, userId: payload.userId, expiresAt });

  return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}

export async function requestPasswordReset(email: string) {
  const user = await userRepository.findByEmail(email);
  if (!user) return;

  const token = generateToken(32);
  const expiresAt = new Date();
  expiresAt.setHours(expiresAt.getHours() + 1);
  await passwordResetTokenRepository.create({ token, userId: user.id, expiresAt });
}

export async function resetPassword(token: string, newPassword: string) {
  const storedToken = await passwordResetTokenRepository.findByToken(token);
  if (!storedToken || storedToken.usedAt || storedToken.expiresAt < new Date()) {
    throw new AppError(400, 'Invalid or expired reset token');
  }

  const hashedPassword = await hashPassword(newPassword);
  const { prisma } = await import('../index');
  await prisma.user.update({ where: { id: storedToken.userId }, data: { password: hashedPassword } });
  await passwordResetTokenRepository.markUsed(storedToken.id);
  await refreshTokenRepository.revokeUserTokens(storedToken.userId);
}
