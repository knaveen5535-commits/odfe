import { Router } from 'express';
import * as sessionController from '../controllers/session.controller';

const router = Router();

router.get('/', sessionController.getSessions);
router.post('/', sessionController.createSession);
router.put('/:id', sessionController.updateSession);

export default router;
