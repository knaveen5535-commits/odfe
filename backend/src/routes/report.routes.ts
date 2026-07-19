import { Router } from 'express';
import * as reportController from '../controllers/report.controller';

const router = Router();

router.get('/sales', reportController.getSalesReport);
router.get('/products', reportController.getProductsReport);
router.get('/categories', reportController.getCategoriesReport);
router.get('/employees', reportController.getEmployeesReport);
router.get('/payments', reportController.getPaymentsReport);

export default router;
