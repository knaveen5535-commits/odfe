# Database Schema

## Overview
PostgreSQL 15 database with 25+ tables managed by both Odoo ORM and Prisma ORM.

## Key Tables

### Core Business
- `users` - System users with role-based access
- `employees` - Cafe staff linked to users
- `roles` - Role definitions (Admin, Cashier, Waiter, Kitchen)
- `products`, `categories`, `taxes`, `uoms` - Product catalog

### POS Operations
- `orders`, `order_lines` - Customer orders with line items
- `carts`, `cart_lines` - Active shopping carts
- `payments` - Payment records (Cash, Card, UPI, QR)
- `pos_sessions` - POS shift management

### Operations
- `floors`, `tables` - Floor plan and table management
- `bookings`, `reservations` - Customer reservations
- `kitchen_orders`, `kitchen_items` - KDS orders
- `coupons`, `promotions` - Discount management
- `customers`, `loyalty_points` - Customer profiles and loyalty

### System
- `refresh_tokens` - JWT refresh token storage
- `password_reset_tokens` - Password reset flow
- `audit_logs` - Activity tracking
- `receipts` - Generated receipts

## Conventions
- UUID primary keys on all tables
- `created_at`/`updated_at` timestamps on all tables
- Indexes on frequently queried columns (status, dates, foreign keys)
- Auto-updating `updated_at` via trigger function
