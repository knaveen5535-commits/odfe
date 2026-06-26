"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const index_1 = require("../index");
const errors_1 = require("../utils/errors");
async function getAll(req, res) {
    const { search } = req.query;
    const where = search ? { OR: [{ name: { contains: search } }, { phone: { contains: search } }] } : {};
    const customers = await index_1.prisma.customer.findMany({ where, orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: customers });
}
async function getById(req, res) {
    const customer = await index_1.prisma.customer.findUnique({
        where: { id: req.params.id },
        include: { orders: true, loyaltyPointsRel: true },
    });
    if (!customer)
        throw new errors_1.NotFoundError('Customer');
    res.json({ success: true, data: customer });
}
async function create(req, res) {
    const customer = await index_1.prisma.customer.create({ data: req.body });
    res.status(201).json({ success: true, data: customer });
}
async function update(req, res) {
    const customer = await index_1.prisma.customer.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: customer });
}
async function remove(req, res) {
    await index_1.prisma.customer.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Customer deleted' });
}
//# sourceMappingURL=customer.controller.js.map