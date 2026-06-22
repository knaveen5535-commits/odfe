import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as couponController from '../controllers/coupon.controller';

const router = Router();

router.use(authenticate);
router.get('/', couponController.getAll);
router.get('/:id', couponController.getById);
router.post('/', couponController.create);
router.put('/:id', couponController.update);
router.delete('/:id', couponController.remove);
router.post('/validate', couponController.validate);

export default router;
