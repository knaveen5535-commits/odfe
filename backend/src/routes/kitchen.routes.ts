import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as kitchenController from '../controllers/kitchen.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'KITCHEN_STAFF'));
router.get('/orders', kitchenController.getOrders);
router.put('/orders/:id/status', kitchenController.updateStatus);
router.put('/items/:itemId/status', kitchenController.updateItemStatus);

export default router;
