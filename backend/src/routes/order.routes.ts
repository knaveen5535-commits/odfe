import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as orderController from '../controllers/order.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'CASHIER', 'KITCHEN_STAFF'));
router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.post('/', orderController.create);
router.put('/:id/status', orderController.updateStatus);
router.delete('/:id', orderController.remove);

export default router;
