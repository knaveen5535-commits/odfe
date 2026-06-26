"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.updateStatus = updateStatus;
const index_1 = require("../index");
const errors_1 = require("../utils/errors");
async function getAll(req, res) {
    const { floorId } = req.query;
    const where = floorId ? { floorId: floorId } : {};
    const tables = await index_1.prisma.table.findMany({
        where,
        include: { floor: true, orders: { where: { status: { notIn: ['PAID', 'CANCELLED'] } }, take: 1 } },
        orderBy: [{ floorId: 'asc' }, { sequence: 'asc' }],
    });
    res.json({ success: true, data: tables });
}
async function getById(req, res) {
    const table = await index_1.prisma.table.findUnique({
        where: { id: req.params.id },
        include: { floor: true, orders: { where: { status: { notIn: ['PAID', 'CANCELLED'] } }, take: 1, include: { orderLines: { include: { product: true } } } } },
    });
    if (!table)
        throw new errors_1.NotFoundError('Table');
    res.json({ success: true, data: table });
}
async function updateStatus(req, res) {
    const table = await index_1.prisma.table.update({ where: { id: req.params.id }, data: { status: req.body.status } });
    res.json({ success: true, data: table });
}
//# sourceMappingURL=table.controller.js.map