import { Request, Response } from 'express';

export const getSessions = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};

export const createSession = async (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
};

export const updateSession = async (req: Request, res: Response) => {
  res.json({ success: true, data: {} });
};
