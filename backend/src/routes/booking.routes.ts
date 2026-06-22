import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import * as bookingController from '../controllers/booking.controller';

const router = Router();

router.use(authenticate);
router.get('/', bookingController.getAll);
router.get('/:id', bookingController.getById);
router.post('/', bookingController.create);
router.put('/:id', bookingController.update);
router.delete('/:id', bookingController.remove);

export default router;
