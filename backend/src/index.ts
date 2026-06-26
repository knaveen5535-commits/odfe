import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { PrismaClient } from '@prisma/client';
import { errorHandler } from './middleware/error.middleware';
import { initializeSocket } from './socket';
import authRoutes from './routes/auth.routes';
import productRoutes from './routes/product.routes';
import categoryRoutes from './routes/category.routes';
import orderRoutes from './routes/order.routes';
import paymentRoutes from './routes/payment.routes';
import bookingRoutes from './routes/booking.routes';
import customerRoutes from './routes/customer.routes';
import employeeRoutes from './routes/employee.routes';
import dashboardRoutes from './routes/dashboard.routes';
import couponRoutes from './routes/coupon.routes';
import promotionRoutes from './routes/promotion.routes';
import tableRoutes from './routes/table.routes';
import floorRoutes from './routes/floor.routes';
import kitchenRoutes from './routes/kitchen.routes';
import settingRoutes from './routes/settings.routes';

export const prisma = new PrismaClient();

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
app.use(helmet());
app.use(cors({ 
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }, 
  credentials: true 
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/customers', customerRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/promotions', promotionRoutes);
app.use('/api/tables', tableRoutes);
app.use('/api/floors', floorRoutes);
app.use('/api/kitchen', kitchenRoutes);
app.use('/api/settings', settingRoutes);

app.get('/api/health', (_req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});

app.use(errorHandler);

const httpServer = createServer(app);
initializeSocket(httpServer);

const PORT = parseInt(process.env.PORT || '4000', 10);

httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;
