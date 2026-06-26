import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth.middleware';
import { prisma } from '../index';

const router = Router();

router.use(authenticate);
router.use(authorize('ADMIN', 'CASHIER'));
router.get('/', async (_req, res) => {
  const floors = await prisma.floor.findMany({ include: { tables: { orderBy: { sequence: 'asc' } } } });
  res.json({ success: true, data: floors });
});
router.get('/:id', async (req, res) => {
  const floor = await prisma.floor.findUnique({ where: { id: req.params.id }, include: { tables: true } });
  res.json({ success: true, data: floor });
});

export default router;
