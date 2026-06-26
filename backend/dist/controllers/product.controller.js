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
    const { categoryId, isAvailable, search } = req.query;
    const where = {};
    if (categoryId)
        where.categoryId = categoryId;
    if (isAvailable !== undefined)
        where.isAvailable = isAvailable === 'true';
    if (search)
        where.name = { contains: search };
    const products = await index_1.prisma.product.findMany({
        where,
        include: { category: true, tax: true, uom: true },
        orderBy: [{ sequence: 'asc' }, { name: 'asc' }],
    });
    res.json({ success: true, data: products });
}
async function getById(req, res) {
    const product = await index_1.prisma.product.findUnique({
        where: { id: req.params.id },
        include: { category: true, tax: true, uom: true },
    });
    if (!product)
        throw new errors_1.NotFoundError('Product');
    res.json({ success: true, data: product });
}
async function create(req, res) {
    const product = await index_1.prisma.product.create({ data: req.body, include: { category: true } });
    res.status(201).json({ success: true, data: product });
}
async function update(req, res) {
    const product = await index_1.prisma.product.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: product });
}
async function remove(req, res) {
    await index_1.prisma.product.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Product deleted' });
}
//# sourceMappingURL=product.controller.js.map