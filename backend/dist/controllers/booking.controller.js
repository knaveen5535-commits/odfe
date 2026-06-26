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
    const bookings = await index_1.prisma.booking.findMany({ include: { customer: true, table: true } });
    res.json({ success: true, data: bookings });
}
async function getById(req, res) {
    const booking = await index_1.prisma.booking.findUnique({
        where: { id: req.params.id },
        include: { customer: true, table: true },
    });
    if (!booking)
        throw new errors_1.NotFoundError('Booking');
    res.json({ success: true, data: booking });
}
async function create(req, res) {
    const booking = await index_1.prisma.booking.create({ data: req.body });
    res.status(201).json({ success: true, data: booking });
}
async function update(req, res) {
    const booking = await index_1.prisma.booking.update({
        where: { id: req.params.id },
        data: req.body,
    });
    res.json({ success: true, data: booking });
}
async function remove(req, res) {
    await index_1.prisma.booking.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Booking deleted' });
}
//# sourceMappingURL=booking.controller.js.map