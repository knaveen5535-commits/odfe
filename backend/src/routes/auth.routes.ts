import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { authLimiter } from '../middleware/rate-limit.middleware';
import * as authController from '../controllers/auth.controller';

const router = Router();

router.post('/register', authLimiter, authController.register);
router.post('/login', authLimiter, authController.login);
router.post('/logout', authController.logout);
router.post('/refresh', authController.refresh);
router.post('/request-password-reset', authController.requestPasswordReset);
router.post('/reset-password', authController.resetPassword);
router.get('/profile', authenticate, authController.getProfile);

export default router;
