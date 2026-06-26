"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSummary = getSummary;
exports.getRevenueChart = getRevenueChart;
exports.getTopProducts = getTopProducts;
const index_1 = require("../index");
async function getSummary(_req, res) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const todayOrders = await index_1.prisma.order.findMany({ where: { orderDate: { gte: today, lt: tomorrow } } });
    const totalRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);
    const pendingOrders = await index_1.prisma.order.count({ where: { status: 'DRAFT' } });
    const totalEmployees = await index_1.prisma.employee.count({ where: { isActive: true } });
    const activeTables = await index_1.prisma.table.count({ where: { status: 'OCCUPIED' } });
    res.json({
        success: true,
        data: {
            todayOrders: todayOrders.length,
            totalRevenue,
            averageOrder: todayOrders.length > 0 ? totalRevenue / todayOrders.length : 0,
            pendingOrders,
            totalEmployees,
            activeTables,
        },
    });
}
async function getRevenueChart(req, res) {
    const days = parseInt(req.query.days) || 7;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    startDate.setHours(0, 0, 0, 0);
    const orders = await index_1.prisma.order.findMany({
        where: { orderDate: { gte: startDate }, status: 'PAID' },
        select: { orderDate: true, total: true },
        orderBy: { orderDate: 'asc' },
    });
    const daily = new Map();
    for (let i = 0; i < days; i++) {
        const d = new Date(startDate);
        d.setDate(d.getDate() + i);
        daily.set(d.toISOString().split('T')[0], 0);
    }
    for (const o of orders) {
        const day = o.orderDate.toISOString().split('T')[0];
        daily.set(day, (daily.get(day) || 0) + o.total);
    }
    res.json({
        success: true,
        data: Array.from(daily.entries()).map(([date, revenue]) => ({ date, revenue })),
    });
}
async function getTopProducts(req, res) {
    const limit = parseInt(req.query.limit) || 10;
    const orderLines = await index_1.prisma.orderLine.groupBy({
        by: ['productId'],
        _sum: { qty: true, subtotal: true },
        orderBy: { _sum: { qty: 'desc' } },
        take: limit,
    });
    const products = await index_1.prisma.product.findMany({
        where: { id: { in: orderLines.map((l) => l.productId) } },
    });
    const productMap = new Map(products.map((p) => [p.id, p]));
    const data = orderLines.map((l) => ({
        product: productMap.get(l.productId)?.name || 'Unknown',
        qty: l._sum.qty || 0,
        revenue: l._sum.subtotal || 0,
    }));
    res.json({ success: true, data });
}
//# sourceMappingURL=dashboard.controller.js.map