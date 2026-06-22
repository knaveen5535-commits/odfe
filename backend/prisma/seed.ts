import { PrismaClient, RoleType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const adminPassword = await bcrypt.hash('admin123', 12);

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@odfe.com' },
    update: {},
    create: {
      email: 'admin@odfe.com',
      password: adminPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: RoleType.ADMIN,
    },
  });

  const adminRole = await prisma.role.upsert({
    where: { code: 'admin' },
    update: {},
    create: { name: 'Admin', code: 'admin', isAdmin: true },
  });

  await prisma.employee.upsert({
    where: { employeeCode: 'EMP001' },
    update: {},
    create: {
      employeeCode: 'EMP001',
      name: 'Admin User',
      userId: adminUser.id,
      roleId: adminRole.id,
    },
  });

  const cashRole = await prisma.role.upsert({
    where: { code: 'cashier' },
    update: {},
    create: { name: 'Cashier', code: 'cashier', isCashier: true },
  });

  const waiterRole = await prisma.role.upsert({
    where: { code: 'waiter' },
    update: {},
    create: { name: 'Waiter', code: 'waiter', isWaiter: true },
  });

  const kitchenRole = await prisma.role.upsert({
    where: { code: 'kitchen' },
    update: {},
    create: { name: 'Kitchen Staff', code: 'kitchen', isKitchen: true },
  });

  const uom = await prisma.uOM.upsert({
    where: { id: 'default-unit' },
    update: {},
    create: { id: 'default-unit', name: 'Unit', code: 'pc', category: 'unit' },
  });

  const coffeeCat = await prisma.category.upsert({
    where: { id: 'cat-coffee' },
    update: {},
    create: { id: 'cat-coffee', name: 'Coffee', sequence: 10 },
  });

  const foodCat = await prisma.category.upsert({
    where: { id: 'cat-food' },
    update: {},
    create: { id: 'cat-food', name: 'Food', sequence: 20 },
  });

  const beverageCat = await prisma.category.upsert({
    where: { id: 'cat-beverage' },
    update: {},
    create: { id: 'cat-beverage', name: 'Beverages', sequence: 30 },
  });

  const tax = await prisma.tax.upsert({
    where: { id: 'tax-gst5' },
    update: {},
    create: { id: 'tax-gst5', name: 'GST 5%', rate: 5, type: 'exclusive' },
  });

  const products = [
    { name: 'Espresso', categoryId: 'cat-coffee', price: 3.5, kitchenCat: 'beverage' },
    { name: 'Cappuccino', categoryId: 'cat-coffee', price: 4.5, kitchenCat: 'beverage' },
    { name: 'Latte', categoryId: 'cat-coffee', price: 5.0, kitchenCat: 'beverage' },
    { name: 'Club Sandwich', categoryId: 'cat-food', price: 8.0, kitchenCat: 'main' },
    { name: 'Grilled Chicken', categoryId: 'cat-food', price: 12.0, kitchenCat: 'main' },
    { name: 'Caesar Salad', categoryId: 'cat-food', price: 7.5, kitchenCat: 'starter' },
    { name: 'French Fries', categoryId: 'cat-food', price: 4.0, kitchenCat: 'starter' },
    { name: 'Chocolate Cake', categoryId: 'cat-food', price: 5.5, kitchenCat: 'dessert' },
    { name: 'Orange Juice', categoryId: 'cat-beverage', price: 3.5, kitchenCat: 'beverage' },
    { name: 'Iced Tea', categoryId: 'cat-beverage', price: 3.0, kitchenCat: 'beverage' },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: `prod-${p.name.toLowerCase().replace(/\s+/g, '-')}` },
      update: {},
      create: {
        id: `prod-${p.name.toLowerCase().replace(/\s+/g, '-')}`,
        name: p.name,
        categoryId: p.categoryId,
        uomId: uom.id,
        salePrice: p.price,
        costPrice: p.price * 0.35,
        taxId: tax.id,
        kitchenCategory: p.kitchenCat,
      },
    });
  }

  const floor = await prisma.floor.upsert({
    where: { id: 'floor-main' },
    update: {},
    create: { id: 'floor-main', name: 'Main Floor', code: 'MAIN' },
  });

  const tables = [
    { id: 'table-1', name: 'Table 1', x: 50, y: 100, cap: 2 },
    { id: 'table-2', name: 'Table 2', x: 250, y: 100, cap: 4 },
    { id: 'table-3', name: 'Table 3', x: 450, y: 100, cap: 4 },
    { id: 'table-4', name: 'Table 4', x: 150, y: 300, cap: 6 },
    { id: 'table-5', name: 'Table 5', x: 350, y: 300, cap: 8 },
  ];

  for (const t of tables) {
    await prisma.table.upsert({
      where: { id: t.id },
      update: {},
      create: { id: t.id, name: t.name, floorId: floor.id, posX: t.x, posY: t.y, capacity: t.cap },
    });
  }

  const methods = [
    { name: 'Cash', code: 'CASH', type: 'cash' },
    { name: 'Card', code: 'CARD', type: 'card' },
    { name: 'UPI', code: 'UPI', type: 'upi' },
    { name: 'QR Code', code: 'QR', type: 'qr' },
  ];

  for (const m of methods) {
    await prisma.paymentMethod.upsert({
      where: { code: m.code },
      update: {},
      create: { name: m.name, code: m.code, methodType: m.type },
    });
  }

  console.log('Seed completed successfully');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
