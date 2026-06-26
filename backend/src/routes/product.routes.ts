import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as productController from '../controllers/product.controller';

const router = Router();

router.use(authenticate);
router.get('/', productController.getAll);
router.get('/:id', productController.getById);
router.post('/', authorize('ADMIN'), productController.create);
router.put('/:id', authorize('ADMIN'), productController.update);
router.delete('/:id', authorize('ADMIN'), productController.remove);

export default router;
