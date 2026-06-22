import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as tableController from '../controllers/table.controller';

const router = Router();

router.use(authenticate);
router.get('/', tableController.getAll);
router.get('/:id', tableController.getById);
router.put('/:id/status', tableController.updateStatus);

export default router;
