import { Request, Response } from 'express';
import { prisma } from '../index';

export async function getSummary(req: Request, res: Response): Promise<void> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const todayOrders = await prisma.order.findMany({ where: { orderDate: { gte: today, lt: tomorrow } } });
  const totalRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

  const pendingOrders = await prisma.order.count({ where: { status: 'DRAFT' } });
  const totalEmployees = await prisma.employee.count({ where: { isActive: true } });
  const activeTables = await prisma.table.count({ where: { status: 'OCCUPIED' } });

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

export async function getRevenueChart(req: Request, res: Response): Promise<void> {
  const days = parseInt(req.query.days as string) || 7;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  startDate.setHours(0, 0, 0, 0);

  const orders = await prisma.order.findMany({
    where: { orderDate: { gte: startDate }, status: 'PAID' },
    select: { orderDate: true, total: true },
    orderBy: { orderDate: 'asc' },
  });

  const daily = new Map<string, number>();
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

export async function getTopProducts(req: Request, res: Response): Promise<void> {
  const limit = parseInt(req.query.limit as string) || 10;
  const orderLines = await prisma.orderLine.groupBy({
    by: ['productId'],
    _sum: { qty: true, subtotal: true },
    orderBy: { _sum: { qty: 'desc' } },
    take: limit,
  });
  const products = await prisma.product.findMany({
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
