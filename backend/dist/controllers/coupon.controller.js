"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = getAll;
exports.getById = getById;
exports.create = create;
exports.update = update;
exports.remove = remove;
exports.validate = validate;
const index_1 = require("../index");
const errors_1 = require("../utils/errors");
async function getAll(_req, res) {
    const coupons = await index_1.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data: coupons });
}
async function getById(req, res) {
    const coupon = await index_1.prisma.coupon.findUnique({ where: { id: req.params.id } });
    if (!coupon)
        throw new errors_1.NotFoundError('Coupon');
    res.json({ success: true, data: coupon });
}
async function create(req, res) {
    const coupon = await index_1.prisma.coupon.create({ data: req.body });
    res.status(201).json({ success: true, data: coupon });
}
async function update(req, res) {
    const coupon = await index_1.prisma.coupon.update({ where: { id: req.params.id }, data: req.body });
    res.json({ success: true, data: coupon });
}
async function remove(req, res) {
    await index_1.prisma.coupon.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Coupon deleted' });
}
async function validate(req, res) {
    const { code, orderTotal } = req.body;
    const coupon = await index_1.prisma.coupon.findUnique({ where: { code } });
    if (!coupon)
        throw new errors_1.NotFoundError('Coupon');
    const now = new Date();
    const isValid = coupon.isActive && now >= coupon.validFrom && now <= coupon.validUntil &&
        (coupon.usageLimit === 0 || coupon.usageCount < coupon.usageLimit) &&
        orderTotal >= coupon.minimumOrder;
    res.json({ success: true, data: { valid: isValid, coupon } });
}
//# sourceMappingURL=coupon.controller.js.map