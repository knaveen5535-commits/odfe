"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getOrders = getOrders;
exports.updateStatus = updateStatus;
exports.updateItemStatus = updateItemStatus;
const index_1 = require("../index");
const errors_1 = require("../utils/errors");
async function getOrders(req, res) {
    const statusFilter = req.query.status?.split(',') || ['new', 'preparing', 'ready'];
    const orders = await index_1.prisma.kitchenOrder.findMany({
        where: { status: { in: statusFilter } },
        include: { items: { include: { product: { select: { name: true } } } } },
        orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
    });
    res.json({ success: true, data: orders });
}
async function updateStatus(req, res) {
    const { status } = req.body;
    const validTransitions = {
        new: ['preparing', 'cancelled'],
        preparing: ['ready', 'cancelled'],
        ready: ['served'],
    };
    const order = await index_1.prisma.kitchenOrder.findUnique({ where: { id: req.params.id } });
    if (!order)
        throw new errors_1.NotFoundError('Kitchen order');
    const allowed = validTransitions[order.status] || [];
    if (!allowed.includes(status)) {
        res.status(400).json({ success: false, error: `Invalid transition from ${order.status} to ${status}` });
        return;
    }
    const updated = await index_1.prisma.kitchenOrder.update({ where: { id: req.params.id }, data: { status } });
    res.json({ success: true, data: updated });
}
async function updateItemStatus(req, res) {
    const { status } = req.body;
    const item = await index_1.prisma.kitchenItem.update({ where: { id: req.params.itemId }, data: { status } });
    res.json({ success: true, data: item });
}
//# sourceMappingURL=kitchen.controller.js.map