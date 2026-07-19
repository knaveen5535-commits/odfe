import { Router } from 'express';
import * as selfOrderController from '../controllers/self-order.controller';

const router = Router();

router.get('/qr-codes', selfOrderController.getQRCodes);
router.post('/online', selfOrderController.placeOnlineOrder);

export default router;
