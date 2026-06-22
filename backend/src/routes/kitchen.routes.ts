import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as kitchenController from '../controllers/kitchen.controller';

const router = Router();

router.use(authenticate);
router.get('/orders', kitchenController.getOrders);
router.put('/orders/:id/status', kitchenController.updateStatus);
router.put('/items/:itemId/status', kitchenController.updateItemStatus);

export default router;
