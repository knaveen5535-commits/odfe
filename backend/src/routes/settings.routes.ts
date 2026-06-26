import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import * as settingsController from '../controllers/settings.controller';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN'));
router.get('/', settingsController.getSettings);
router.put('/', settingsController.updateSettings);

export default router;
