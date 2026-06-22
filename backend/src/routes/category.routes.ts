import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as categoryController from '../controllers/category.controller';

const router = Router();

router.use(authenticate);
router.get('/', categoryController.getAll);
router.get('/:id', categoryController.getById);
router.post('/', categoryController.create);
router.put('/:id', categoryController.update);
router.delete('/:id', categoryController.remove);

export default router;
