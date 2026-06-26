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
    const categories = await index_1.prisma.category.findMany({ include: { children: true, _count: { select: { products: true } } } });
    res.json({ success: true, data: categories });
}
async function getById(req, res) {
    const category = await index_1.prisma.category.findUnique({
        where: { id: req.params.id },
        include: { products: true, children: true },
    });
    if (!category)
        throw new errors_1.NotFoundError('Category');
    res.json({ success: true, data: category });
}
async function create(req, res) {
    const category = await index_1.prisma.category.create({ data: req.body });
    res.status(201).json({ success: true, data: category });
}
async function update(req, res) {
    const category = await index_1.prisma.category.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: category });
}
async function remove(req, res) {
    await index_1.prisma.category.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Category deleted' });
}
//# sourceMappingURL=category.controller.js.map