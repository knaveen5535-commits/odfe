# Roles & Permissions

## Role Hierarchy

### Admin
Full system access. Can manage employees, products, settings, and all POS operations.

### Cashier
Can process orders and payments. View-only access to products, customers, and reports.

### Waiter
Can create orders, manage tables, and view customer information. Cannot process payments.

### Kitchen Staff
View-only access to kitchen orders. Can update order status (preparing -> ready).

## Permissions Matrix
| Resource | Admin | Cashier | Waiter | Kitchen |
|----------|-------|---------|--------|---------|
| Products | CRUD  | R       | R      | -       |
| Orders   | CRUD  | CRUD    | CRU    | R       |
| Payments | CRUD  | CRU     | -      | -       |
| Employees| CRUD  | R       | -      | -       |
| Customers| CRUD  | CRUD    | CR     | -       |
| Bookings | CRUD  | CRU     | CRU    | -       |
| Kitchen  | CRUD  | R       | R      | CRU     |
| Reports  | CRUD  | R       | R      | -       |
| Settings | CRUD  | -       | -      | -       |
