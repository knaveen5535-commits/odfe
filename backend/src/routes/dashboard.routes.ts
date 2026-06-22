import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as dashboardController from '../controllers/dashboard.controller';

const router = Router();

router.use(authenticate);
router.get('/summary', dashboardController.getSummary);
router.get('/revenue', dashboardController.getRevenueChart);
router.get('/top-products', dashboardController.getTopProducts);

export default router;
