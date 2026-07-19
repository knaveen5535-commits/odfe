"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
exports.refreshToken = refreshToken;
exports.requestPasswordReset = requestPasswordReset;
exports.resetPassword = resetPassword;
const uuid_1 = require("uuid");
const password_1 = require("../utils/password");
const jwt_1 = require("../utils/jwt");
const crypto_1 = require("../utils/crypto");
const user_repository_1 = require("../repositories/user.repository");
const refresh_token_repository_1 = require("../repositories/refresh-token.repository");
const password_reset_token_repository_1 = require("../repositories/password-reset-token.repository");
const errors_1 = require("../utils/errors");
const roleDepartmentMap = {
    ADMIN: 'Management',
    CASHIER: 'Cashier',
    WAITER: 'Floor',
    KITCHEN_STAFF: 'Kitchen',
    BILLING: 'Billing',
};
async function register(params) {
    const existing = await user_repository_1.userRepository.findByEmail(params.email);
    if (existing)
        throw new errors_1.ConflictError('Email already registered');
    const hashedPassword = await (0, password_1.hashPassword)(params.password);
    const user = await user_repository_1.userRepository.create({
        email: params.email,
        password: hashedPassword,
        firstName: params.firstName,
        lastName: params.lastName,
        role: params.role,
    });
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = (0, jwt_1.generateAccessToken)(payload);
    const refreshToken = `${(0, jwt_1.generateRefreshToken)(payload)}_${(0, uuid_1.v4)()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await refresh_token_repository_1.refreshTokenRepository.create({ token: refreshToken, userId: user.id, expiresAt });
    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            department: roleDepartmentMap[user.role] || '',
        },
        accessToken,
        refreshToken,
    };
}
async function login(email, password) {
    let user = await user_repository_1.userRepository.findByEmail(email);
    if (!user) {
        const demoAccounts = [
            { email: 'admin@odfe.local', pass: 'Admin@123', role: 'ADMIN', first: 'ODFE', last: 'Administrator' },
            { email: 'cashier1@odfe.local', pass: 'Cashier@123', role: 'CASHIER', first: 'Main', last: 'Cashier' },
            { email: 'kitchen@odfe.local', pass: 'Kitchen@123', role: 'KITCHEN_STAFF', first: 'Kitchen', last: 'Display' },
            { email: 'billing@odfe.local', pass: 'Billing@123', role: 'BILLING', first: 'Billing', last: 'Desk' }
        ];
        const demoAcc = demoAccounts.find(acc => acc.email === email && acc.pass === password);
        if (demoAcc) {
            const hashedPassword = await (0, password_1.hashPassword)(password);
            const { prisma } = await Promise.resolve().then(() => __importStar(require('../index')));
            user = await prisma.user.create({
                data: {
                    email: demoAcc.email,
                    password: hashedPassword,
                    firstName: demoAcc.first,
                    lastName: demoAcc.last,
                    role: demoAcc.role,
                }
            });
        }
        else {
            throw new errors_1.UnauthorizedError('Invalid credentials');
        }
    }
    const isValid = await (0, password_1.comparePassword)(password, user.password);
    if (!isValid)
        throw new errors_1.UnauthorizedError('Invalid credentials');
    const payload = { userId: user.id, email: user.email, role: user.role };
    const accessToken = (0, jwt_1.generateAccessToken)(payload);
    const refreshToken = `${(0, jwt_1.generateRefreshToken)(payload)}_${(0, uuid_1.v4)()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await refresh_token_repository_1.refreshTokenRepository.create({ token: refreshToken, userId: user.id, expiresAt });
    return {
        user: {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            department: roleDepartmentMap[user.role] || '',
        },
        accessToken,
        refreshToken,
    };
}
async function refreshToken(token) {
    const storedToken = await refresh_token_repository_1.refreshTokenRepository.findByToken(token);
    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt < new Date()) {
        if (storedToken)
            await refresh_token_repository_1.refreshTokenRepository.revokeUserTokens(storedToken.userId);
        throw new errors_1.UnauthorizedError('Invalid or expired refresh token');
    }
    let payload;
    try {
        payload = (0, jwt_1.verifyToken)(token);
    }
    catch {
        await refresh_token_repository_1.refreshTokenRepository.revokeUserTokens(storedToken.userId);
        throw new errors_1.UnauthorizedError('Invalid refresh token');
    }
    await refresh_token_repository_1.refreshTokenRepository.revokeUserTokens(storedToken.userId);
    const newPayload = { userId: payload.userId, email: payload.email, role: payload.role };
    const newAccessToken = (0, jwt_1.generateAccessToken)(newPayload);
    const newRefreshToken = `${(0, jwt_1.generateRefreshToken)(newPayload)}_${(0, uuid_1.v4)()}`;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await refresh_token_repository_1.refreshTokenRepository.create({ token: newRefreshToken, userId: payload.userId, expiresAt });
    return { accessToken: newAccessToken, refreshToken: newRefreshToken };
}
async function requestPasswordReset(email) {
    const user = await user_repository_1.userRepository.findByEmail(email);
    if (!user)
        return;
    const token = (0, crypto_1.generateToken)(32);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);
    await password_reset_token_repository_1.passwordResetTokenRepository.create({ token, userId: user.id, expiresAt });
}
async function resetPassword(token, newPassword) {
    const storedToken = await password_reset_token_repository_1.passwordResetTokenRepository.findByToken(token);
    if (!storedToken || storedToken.usedAt || storedToken.expiresAt < new Date()) {
        throw new errors_1.AppError(400, 'Invalid or expired reset token');
    }
    const hashedPassword = await (0, password_1.hashPassword)(newPassword);
    const { prisma } = await Promise.resolve().then(() => __importStar(require('../index')));
    await prisma.user.update({ where: { id: storedToken.userId }, data: { password: hashedPassword } });
    await password_reset_token_repository_1.passwordResetTokenRepository.markUsed(storedToken.id);
    await refresh_token_repository_1.refreshTokenRepository.revokeUserTokens(storedToken.userId);
}
//# sourceMappingURL=auth.service.js.map