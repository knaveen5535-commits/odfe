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
exports.logout = logout;
exports.refresh = refresh;
exports.requestPasswordReset = requestPasswordReset;
exports.resetPassword = resetPassword;
exports.getProfile = getProfile;
const zod_1 = require("zod");
const authService = __importStar(require("../services/auth.service"));
const index_1 = require("../index");
const errors_1 = require("../utils/errors");
const registerSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(8),
    firstName: zod_1.z.string().optional(),
    lastName: zod_1.z.string().optional(),
    role: zod_1.z.string().optional(),
});
const loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string(),
});
async function register(req, res) {
    const data = registerSchema.parse(req.body);
    const result = await authService.register({ ...data, role: data.role || 'ADMIN' });
    res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(201).json({ success: true, data: { accessToken: result.accessToken, user: result.user } });
}
async function login(req, res) {
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
async function logout(req, res) {
    const refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
        await index_1.prisma.refreshToken.updateMany({
            where: { token: refreshToken, revokedAt: null },
            data: { revokedAt: new Date() },
        });
    }
    res.clearCookie('refreshToken');
    res.json({ success: true, message: 'Logged out' });
}
async function refresh(req, res) {
    const token = req.cookies?.refreshToken || req.body.refreshToken;
    if (!token)
        throw new errors_1.AppError(401, 'Refresh token required');
    const result = await authService.refreshToken(token);
    res.json({ success: true, data: result });
}
async function requestPasswordReset(req, res) {
    const { email } = req.body;
    await authService.requestPasswordReset(email);
    res.json({ success: true, message: 'If the email exists, a reset link has been sent' });
}
async function resetPassword(req, res) {
    const { token, password } = req.body;
    await authService.resetPassword(token, password);
    res.json({ success: true, message: 'Password reset successfully' });
}
const roleDepartmentMap = {
    ADMIN: 'Management',
    CASHIER: 'Cashier',
    KITCHEN_STAFF: 'Kitchen',
    BILLING: 'Billing',
};
async function getProfile(req, res) {
    const user = await index_1.prisma.user.findUnique({
        where: { id: req.user.userId },
        select: { id: true, email: true, firstName: true, lastName: true, role: true },
    });
    if (!user)
        throw new errors_1.AppError(404, 'User not found');
    res.json({
        success: true,
        data: { ...user, department: roleDepartmentMap[user.role] || '' },
    });
}
//# sourceMappingURL=auth.controller.js.map