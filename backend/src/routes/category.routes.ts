import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as categoryController from '../controllers/category.controller';

const router = Router();

router.use(authenticate);
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', authorize('ADMIN'), categoryController.create);
router.put('/:id', authorize('ADMIN'), categoryController.update);
router.delete('/:id', authorize('ADMIN'), categoryController.remove);

export default router;
