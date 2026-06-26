"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.updateStatus = updateStatus;
exports.remove = remove;
const index_1 = require("../index");
const errors_1 = require("../utils/errors");
async function getAll(req, res) {
    const { status, sessionId, page = '1', limit = '20' } = req.query;
    const where = {};
    if (status)
        where.status = status;
    if (sessionId)
        where.sessionId = sessionId;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);
    const [orders, total] = await Promise.all([
        index_1.prisma.order.findMany({
            where,
            include: { orderLines: { include: { product: true } }, employee: true, customer: true, table: true, payments: true },
            orderBy: { createdAt: 'desc' },
            skip,
            take,
        }),
        index_1.prisma.order.count({ where }),
    ]);
    res.json({ success: true, data: { orders, total, page: parseInt(page), limit: take } });
}
async function getById(req, res) {
    const order = await index_1.prisma.order.findUnique({
        where: { id: req.params.id },
        include: { orderLines: { include: { product: true } }, payments: { include: { method: true } }, employee: true, customer: true, table: true },
    });
    if (!order)
        throw new errors_1.NotFoundError('Order');
    res.json({ success: true, data: order });
}
async function create(req, res) {
    const { items, ...orderData } = req.body;
    const order = await index_1.prisma.order.create({
        data: {
            ...orderData,
            orderRef: `ORD-${Date.now()}`,
            orderLines: {
                create: items.map((item) => ({
                    productId: item.productId,
                    qty: item.qty,
                    priceUnit: item.priceUnit,
                    discount: item.discount || 0,
                    subtotal: item.qty * item.priceUnit * (1 - (item.discount || 0) / 100),
                })),
            },
        },
        include: { orderLines: true },
    });
    await index_1.prisma.kitchenOrder.create({
        data: {
            orderId: order.id,
            displayName: `K-${order.orderRef}`,
            status: 'new',
            items: { create: items.map((item) => ({ productId: item.productId, qty: item.qty })) },
        },
    });
    res.status(201).json({ success: true, data: order });
}
async function updateStatus(req, res) {
    const { status } = req.body;
    const order = await index_1.prisma.order.update({ where: { id: req.params.id }, data: { status } });
    res.json({ success: true, data: order });
}
async function remove(req, res) {
    await index_1.prisma.order.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Order deleted' });
}
//# sourceMappingURL=order.controller.js.map