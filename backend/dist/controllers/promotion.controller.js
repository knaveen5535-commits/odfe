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
    const promotions = await index_1.prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: promotions });
}
async function getById(req, res) {
    const promotion = await index_1.prisma.promotion.findUnique({ where: { id: req.params.id } });
    if (!promotion)
        throw new errors_1.NotFoundError('Promotion');
    res.json({ success: true, data: promotion });
}
async function create(req, res) {
    const promotion = await index_1.prisma.promotion.create({ data: req.body });
    res.status(201).json({ success: true, data: promotion });
}
async function update(req, res) {
    const promotion = await index_1.prisma.promotion.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: promotion });
}
async function remove(req, res) {
    await index_1.prisma.promotion.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Promotion deleted' });
}
//# sourceMappingURL=promotion.controller.js.map