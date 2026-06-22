import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as orderController from '../controllers/order.controller';

const router = Router();

router.use(authenticate);
router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.post('/', orderController.create);
router.put('/:id/status', orderController.updateStatus);
router.delete('/:id', orderController.remove);

export default router;
