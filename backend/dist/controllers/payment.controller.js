"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.refund = refund;
exports.getMethods = getMethods;
const index_1 = require("../index");
const errors_1 = require("../utils/errors");
async function getAll(_req, res) {
    const payments = await index_1.prisma.payment.findMany({
        include: { order: true, method: true },
        orderBy: { paymentDate: 'desc' },
    });
    res.json({ success: true, data: payments });
}
async function getById(req, res) {
    const payment = await index_1.prisma.payment.findUnique({
        where: { id: req.params.id },
        include: { order: { include: { orderLines: true } }, method: true },
    });
    if (!payment)
        throw new errors_1.NotFoundError('Payment');
    res.json({ success: true, data: payment });
}
async function create(req, res) {
    const payment = await index_1.prisma.payment.create({
        data: {
            ...req.body,
            paymentRef: `PAY-${Date.now()}`,
        },
        include: { method: true },
    });
    await index_1.prisma.order.update({ where: { id: req.body.orderId }, data: { status: 'PAID' } });
    res.status(201).json({ success: true, data: payment });
}
async function refund(req, res) {
    const payment = await index_1.prisma.payment.update({
        where: { id: req.params.id },
        data: { status: 'REFUNDED' },
    });
    res.json({ success: true, data: payment });
}
async function getMethods(_req, res) {
    const methods = await index_1.prisma.paymentMethod.findMany({ where: { isActive: true }, orderBy: { sequence: 'asc' } });
    res.json({ success: true, data: methods });
}
//# sourceMappingURL=payment.controller.js.map