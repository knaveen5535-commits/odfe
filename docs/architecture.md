# ODFE Architecture

## Three-Tier Architecture

### 1. Odoo Backend (Python)
Handles core business logic, database ORM, and POS operations through 15 custom Odoo addon modules.

### 2. Node.js/TypeScript API
REST API layer using Express + Prisma ORM + PostgreSQL providing stateless endpoints consumed by the frontend.

### 3. Next.js Frontend
React-based UI with App Router, Tailwind CSS, and JWT-based authentication.

## Data Flow
Frontend (Next.js) -> API (Express/Prisma) -> PostgreSQL
Frontend (Odoo views) <-> Odoo Server <-> PostgreSQL

## Key Design Decisions
- JWT access + refresh token rotation for auth
- Prisma ORM for type-safe database access
- Odoo `odfe.` namespace prefix for all custom models
- Unified API response envelope: { success, data, message, error }
- Role-based access control (Admin, Cashier, Waiter, Kitchen Staff)
