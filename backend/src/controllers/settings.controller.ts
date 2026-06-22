import { Request, Response } from 'express';

export async function getSettings(_req: Request, res: Response): Promise<void> {
  res.json({
    success: true,
    data: {
      storeName: 'ODFE Cafe',
      currency: 'USD',
      taxRate: 5,
      timezone: 'UTC',
      orderPrefix: 'ORD-',
      lowStockThreshold: 10,
    },
  });
}

export async function updateSettings(req: Request, res: Response): Promise<void> {
  res.json({ success: true, data: req.body, message: 'Settings updated' });
}
