import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as customerController from '../controllers/customer.controller';

const router = Router();

router.use(authenticate);
router.get('/', customerController.getAll);
router.get('/:id', customerController.getById);
router.post('/', customerController.create);
router.put('/:id', customerController.update);
router.delete('/:id', customerController.remove);

export default router;
