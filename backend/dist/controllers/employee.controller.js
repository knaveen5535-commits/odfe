"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
const index_1 = require("../index");
const errors_1 = require("../utils/errors");
async function getAll(_req, res) {
    const employees = await index_1.prisma.employee.findMany({ include: { role: true, user: { select: { email: true } } } });
    res.json({ success: true, data: employees });
}
async function getById(req, res) {
    const employee = await index_1.prisma.employee.findUnique({
        where: { id: req.params.id },
        include: { role: true, user: true, orders: { take: 10, orderBy: { createdAt: 'desc' } } },
    });
    if (!employee)
        throw new errors_1.NotFoundError('Employee');
    res.json({ success: true, data: employee });
}
async function create(req, res) {
    const employee = await index_1.prisma.employee.create({ data: req.body });
    res.status(201).json({ success: true, data: employee });
}
async function update(req, res) {
    const employee = await index_1.prisma.employee.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: employee });
}
async function remove(req, res) {
    await index_1.prisma.employee.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Employee deleted' });
}
//# sourceMappingURL=employee.controller.js.map