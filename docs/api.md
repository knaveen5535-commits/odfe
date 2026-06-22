# ODFE API Documentation

## Base URL
- Development: `http://localhost:4000/api`
- Production: Configurable via `NEXT_PUBLIC_API_URL`

## Authentication
All endpoints except `/auth/login`, `/auth/register`, `/auth/refresh`, and public self-order endpoints require a Bearer JWT token.

### Headers
Authorization: Bearer <access_token>
Content-Type: application/json

### Auth Endpoints
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/request-password-reset` - Request password reset
- `POST /auth/reset-password` - Reset password
- `GET /auth/profile` - Get current user profile

### Resource Endpoints
- `GET/POST/PUT/DELETE /products` - Product CRUD
- `GET/POST/PUT/DELETE /categories` - Category CRUD
- `GET/POST/PUT/DELETE /orders` - Order CRUD
- `GET/POST /orders/:id/status` - Update order status
- `GET/POST /payments` - Payment CRUD
- `GET /payments/methods` - Get payment methods
- `GET/POST/PUT/DELETE /customers` - Customer CRUD
- `GET/POST/PUT/DELETE /employees` - Employee CRUD
- `GET/POST/PUT/DELETE /bookings` - Booking CRUD
- `GET/POST/PUT/DELETE /coupons` - Coupon CRUD
- `POST /coupons/validate` - Validate coupon
- `GET/POST/PUT/DELETE /promotions` - Promotion CRUD
- `GET/PUT /tables` - Table management
- `GET/PUT /tables/:id/status` - Update table status
- `GET /floors` - Floor plan data
- `GET /kitchen/orders` - KDS orders
- `PUT /kitchen/orders/:id/status` - Update KDS order status
- `GET /dashboard/summary` - Dashboard summary
- `GET /dashboard/revenue` - Revenue chart data
- `GET /dashboard/top-products` - Top selling products

### Self-Order Endpoints (Public)
- `GET /self-order/menu` - Get menu
- `POST /self-order/session` - Create guest session
- `POST /self-order/place-order` - Place self-order

## Response Format
All responses follow: { success: boolean, data?: any, error?: string, message?: string }
