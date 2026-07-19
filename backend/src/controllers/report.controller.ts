import { Request, Response } from 'express';

export const getSalesReport = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};

export const getProductsReport = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};

export const getCategoriesReport = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};

export const getEmployeesReport = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};

export const getPaymentsReport = async (req: Request, res: Response) => {
  res.json({ success: true, data: [] });
};
