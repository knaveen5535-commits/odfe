import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as employeeController from '../controllers/employee.controller';

const router = Router();

router.use(authenticate);
router.get('/', employeeController.getAll);
router.get('/:id', employeeController.getById);
router.post('/', authorize('ADMIN'), employeeController.create);
router.put('/:id', authorize('ADMIN'), employeeController.update);
router.delete('/:id', authorize('ADMIN'), employeeController.remove);

export default router;
