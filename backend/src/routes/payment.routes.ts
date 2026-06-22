import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as paymentController from '../controllers/payment.controller';

const router = Router();

router.use(authenticate);
router.get('/', paymentController.getAll);
router.get('/methods', paymentController.getMethods);
router.get('/:id', paymentController.getById);
router.post('/', paymentController.create);
router.post('/:id/refund', paymentController.refund);

export default router;
