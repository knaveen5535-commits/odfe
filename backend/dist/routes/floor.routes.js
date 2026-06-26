"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_middleware_1 = require("../middleware/auth.middleware");
const index_1 = require("../index");
const router = (0, express_1.Router)();
router.use(auth_middleware_1.authenticate);
router.use((0, auth_middleware_1.authorize)('ADMIN', 'CASHIER'));
router.get('/', async (_req, res) => {
    const floors = await index_1.prisma.floor.findMany({ include: { tables: { orderBy: { sequence: 'asc' } } } });
    res.json({ success: true, data: floors });
});
router.get('/:id', async (req, res) => {
    const floor = await index_1.prisma.floor.findUnique({ where: { id: req.params.id }, include: { tables: true } });
    res.json({ success: true, data: floor });
});
exports.default = router;
//# sourceMappingURL=floor.routes.js.map