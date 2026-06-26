"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = require("http");
const client_1 = require("@prisma/client");
const error_middleware_1 = require("./middleware/error.middleware");
const socket_1 = require("./socket");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const payment_routes_1 = __importDefault(require("./routes/payment.routes"));
const booking_routes_1 = __importDefault(require("./routes/booking.routes"));
const customer_routes_1 = __importDefault(require("./routes/customer.routes"));
const employee_routes_1 = __importDefault(require("./routes/employee.routes"));
const dashboard_routes_1 = __importDefault(require("./routes/dashboard.routes"));
const coupon_routes_1 = __importDefault(require("./routes/coupon.routes"));
const promotion_routes_1 = __importDefault(require("./routes/promotion.routes"));
const table_routes_1 = __importDefault(require("./routes/table.routes"));
const floor_routes_1 = __importDefault(require("./routes/floor.routes"));
const kitchen_routes_1 = __importDefault(require("./routes/kitchen.routes"));
const settings_routes_1 = __importDefault(require("./routes/settings.routes"));
exports.prisma = new client_1.PrismaClient();
const app = (0, express_1.default)();
const allowedOrigins = ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002'];
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/api/auth', auth_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/categories', category_routes_1.default);
app.use('/api/orders', order_routes_1.default);
app.use('/api/payments', payment_routes_1.default);
app.use('/api/bookings', booking_routes_1.default);
app.use('/api/customers', customer_routes_1.default);
app.use('/api/employees', employee_routes_1.default);
app.use('/api/dashboard', dashboard_routes_1.default);
app.use('/api/coupons', coupon_routes_1.default);
app.use('/api/promotions', promotion_routes_1.default);
app.use('/api/tables', table_routes_1.default);
app.use('/api/floors', floor_routes_1.default);
app.use('/api/kitchen', kitchen_routes_1.default);
app.use('/api/settings', settings_routes_1.default);
app.get('/api/health', (_req, res) => {
    res.json({ success: true, data: { status: 'ok', timestamp: new Date().toISOString() } });
});
app.use(error_middleware_1.errorHandler);
const httpServer = (0, http_1.createServer)(app);
(0, socket_1.initializeSocket)(httpServer);
const PORT = parseInt(process.env.PORT || '4000', 10);
httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
exports.default = app;
//# sourceMappingURL=index.js.map