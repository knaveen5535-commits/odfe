import { Request, Response } from 'express';

export const getQRCodes = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};

export const placeOnlineOrder = async (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
};
