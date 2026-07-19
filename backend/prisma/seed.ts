import { PrismaClient, RoleType, OrderStatus, TableStatus, PaymentStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. Roles
  const roles = [
    { code: 'admin', name: 'Admin', isAdmin: true },
    { code: 'cashier', name: 'Cashier', isCashier: true },
    { code: 'kitchen', name: 'Kitchen Staff', isKitchen: true },
    { code: 'waiter', name: 'Waiter', isWaiter: true },
    { code: 'billing', name: 'Billing', isAdmin: false },
    { code: 'order_manager', name: 'Order Manager', isCashier: true },
  ];

  for (const r of roles) {
    await prisma.role.upsert({
      where: { code: r.code },
      update: {},
      create: { name: r.name, code: r.code, isAdmin: r.isAdmin || false, isCashier: r.isCashier || false, isKitchen: r.isKitchen || false, isWaiter: r.isWaiter || false },
    });
  }

  // 2. Demo Accounts & Employees
  const demoAccounts = [
    { email: 'admin@odfe.local', pass: 'Admin@123', first: 'Admin', last: 'User', roleCode: 'admin', empCode: 'EMP-ADM', roleType: RoleType.ADMIN },
    { email: 'pos@odfe.local', pass: 'Pos@123', first: 'Employee', last: 'POS', roleCode: 'cashier', empCode: 'EMP-POS', roleType: RoleType.CASHIER },
    { email: 'kitchen@odfe.local', pass: 'Kitchen@123', first: 'Kitchen', last: 'Staff', roleCode: 'kitchen', empCode: 'EMP-KIT', roleType: RoleType.KITCHEN_STAFF },
  ];

  for (const acc of demoAccounts) {
    const hash = await bcrypt.hash(acc.pass, 10);
    const user = await prisma.user.upsert({
      where: { email: acc.email },
      update: { password: hash, firstName: acc.first, lastName: acc.last, role: acc.roleType },
      create: { email: acc.email, password: hash, firstName: acc.first, lastName: acc.last, role: acc.roleType },
    });
    
    const role = await prisma.role.findUnique({ where: { code: acc.roleCode } });
    if (role) {
      await prisma.employee.upsert({
        where: { employeeCode: acc.empCode },
        update: {},
        create: { employeeCode: acc.empCode, name: `${acc.first} ${acc.last}`, userId: user.id, roleId: role.id },
      });
    }
  }

  // 3. Categories (7)
  const categoryNames = ['Coffee', 'Tea', 'Pizza', 'Burger', 'Dessert', 'Quick Bites', 'Cold Drinks'];
  const categories = [];
  for (let i = 0; i < categoryNames.length; i++) {
    const cat = await prisma.category.upsert({
      where: { id: `cat-${i}` },
      update: {},
      create: { id: `cat-${i}`, name: categoryNames[i], sequence: i * 10 },
    });
    categories.push(cat);
  }

  // 4. UOM & Tax
  const uom = await prisma.uOM.upsert({
    where: { id: 'uom-pc' },
    update: {},
    create: { id: 'uom-pc', name: 'Piece', code: 'pc' },
  });

  const tax = await prisma.tax.upsert({
    where: { id: 'tax-gst5' },
    update: {},
    create: { id: 'tax-gst5', name: 'GST 5%', rate: 5 },
  });

  // 5. Products (40)
  const productNames = [
    'Espresso', 'Americano', 'Latte', 'Cappuccino', 'Mocha', 'Macchiato', 'Flat White', 'Affogato', 
    'Green Tea', 'Black Tea', 'Earl Grey', 'Chamomile', 'Iced Lemon Tea', 'Matcha Latte',
    'Margherita Pizza', 'Pepperoni Pizza', 'BBQ Chicken Pizza', 'Veggie Supreme', 'Mushroom Truffle Pizza',
    'Classic Cheeseburger', 'Bacon Burger', 'Veggie Burger', 'Spicy Chicken Burger', 'Double Patty Burger',
    'Chocolate Brownie', 'Cheesecake', 'Tiramisu', 'Apple Pie', 'Ice Cream Sundae',
    'French Fries', 'Garlic Bread', 'Onion Rings', 'Chicken Wings', 'Nachos',
    'Cola', 'Lemonade', 'Iced Coffee', 'Mango Smoothie', 'Strawberry Shake', 'Cold Brew'
  ];
  const products = [];
  for (let i = 0; i < productNames.length; i++) {
    let catIndex = 0;
    if (i >= 8 && i < 14) catIndex = 1;
    else if (i >= 14 && i < 19) catIndex = 2;
    else if (i >= 19 && i < 24) catIndex = 3;
    else if (i >= 24 && i < 29) catIndex = 4;
    else if (i >= 29 && i < 34) catIndex = 5;
    else if (i >= 34) catIndex = 6;

    const prod = await prisma.product.upsert({
      where: { id: `prod-${i}` },
      update: {},
      create: {
        id: `prod-${i}`,
        name: productNames[i],
        categoryId: categories[catIndex].id,
        uomId: uom.id,
        salePrice: 5 + (i % 15),
        costPrice: 2 + (i % 5),
        taxId: tax.id,
        isAvailable: true
      },
    });
    products.push(prod);
  }

  // 6. Floors (4)
  const floorNames = ['Ground Floor', 'First Floor', 'Outdoor', 'VIP Lounge'];
  const floors = [];
  for (let i = 0; i < floorNames.length; i++) {
    const f = await prisma.floor.upsert({
      where: { id: `floor-${i}` },
      update: {},
      create: { id: `floor-${i}`, name: floorNames[i], sequence: i },
    });
    floors.push(f);
  }

  // 7. Tables (30)
  const tables = [];
  let tableCounter = 1;
  for (let f = 0; f < floors.length; f++) {
    for (let t = 0; t < 7 + (f % 2); t++) { // ~7-8 tables per floor = 30 total
      const table = await prisma.table.upsert({
        where: { id: `table-${tableCounter}` },
        update: {},
        create: {
          id: `table-${tableCounter}`,
          name: `T${tableCounter}`,
          floorId: floors[f].id,
          capacity: (tableCounter % 4) * 2 + 2,
          posX: (t % 4) * 150 + 50,
          posY: Math.floor(t / 4) * 150 + 50,
        },
      });
      tables.push(table);
      tableCounter++;
    }
  }

  // 8. Customers (100)
  const customers = [];
  for (let i = 1; i <= 100; i++) {
    const cust = await prisma.customer.upsert({
      where: { id: `cust-${i}` },
      update: {},
      create: {
        id: `cust-${i}`,
        name: `Customer ${i}`,
        email: `customer${i}@example.com`,
        phone: `+123456789${i.toString().padStart(2, '0')}`,
        loyaltyPoints: i * 10,
        totalOrders: i % 5,
      },
    });
    customers.push(cust);
  }

  // 9. Payment Methods
  const paymentMethods = [
    { name: 'Cash', code: 'CASH', type: 'cash' },
    { name: 'Card', code: 'CARD', type: 'card' },
    { name: 'UPI', code: 'UPI', type: 'upi' },
    { name: 'Wallet', code: 'WALLET', type: 'wallet' },
    { name: 'Gift Card', code: 'GIFT', type: 'gift' },
  ];
  for (const pm of paymentMethods) {
    await prisma.paymentMethod.upsert({
      where: { code: pm.code },
      update: {},
      create: { name: pm.name, code: pm.code, methodType: pm.type },
    });
  }
  const allPaymentMethods = await prisma.paymentMethod.findMany();

  // 10. Coupons & Promotions
  const coupons = [
    { code: 'WELCOME20', val: 20 },
    { code: 'SAVE100', val: 100 },
    { code: 'FIRSTORDER', val: 15 },
    { code: 'SUMMER25', val: 25 },
  ];
  for (const c of coupons) {
    await prisma.coupon.upsert({
      where: { code: c.code },
      update: {},
      create: {
        code: c.code,
        discountType: c.val > 50 ? 'fixed' : 'percentage',
        discountValue: c.val,
        validFrom: new Date(),
        validUntil: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      },
    });
  }

  await prisma.promotion.createMany({
    skipDuplicates: true,
    data: [
      { name: 'Buy 2 Coffee -> 20% Off', promoType: 'BOGO', discountPercent: 20 },
      { name: 'Spend 500 -> 50 Discount', promoType: 'THRESHOLD', discountPercent: 0 },
      { name: 'Burger + Fries Combo -> 15% Off', promoType: 'COMBO', discountPercent: 15 },
      { name: 'Happy Hour -> 10% Off', promoType: 'TIME_BASED', discountPercent: 10 },
    ]
  });

  // 11. Orders (50) & Kitchen Tickets (20) & Payments
  const cashierEmp = await prisma.employee.findUnique({ where: { employeeCode: 'EMP-POS' } });
  
  if (cashierEmp) {
    for (let i = 1; i <= 50; i++) {
      const isPaid = i <= 40; // 40 paid, 10 pending/draft
      const itemCount = (i % 5) + 1;
      const orderLinesData = [];
      let total = 0;
      
      for(let j = 0; j < itemCount; j++) {
        const prod = products[(i + j) % products.length];
        orderLinesData.push({
          productId: prod.id,
          qty: 1,
          priceUnit: prod.salePrice,
          subtotal: prod.salePrice
        });
        total += prod.salePrice;
      }

      const orderDate = new Date();
      orderDate.setDate(orderDate.getDate() - (i % 7)); // Spread over last 7 days

      const order = await prisma.order.upsert({
        where: { orderRef: `ORD-DEMO-${i}` },
        update: {},
        create: {
          orderRef: `ORD-DEMO-${i}`,
          employeeId: cashierEmp.id,
          customerId: customers[i % customers.length].id,
          tableId: tables[i % tables.length].id,
          status: isPaid ? OrderStatus.PAID : OrderStatus.DRAFT,
          total: total,
          itemCount: itemCount,
          orderDate: orderDate,
          orderLines: {
            create: orderLinesData
          }
        }
      });

      if (isPaid) {
        await prisma.payment.upsert({
          where: { paymentRef: `PAY-DEMO-${i}` },
          update: {},
          create: {
            paymentRef: `PAY-DEMO-${i}`,
            orderId: order.id,
            methodId: allPaymentMethods[i % allPaymentMethods.length].id,
            amount: total,
            status: PaymentStatus.COMPLETED,
            paymentDate: orderDate,
          }
        });
      }

      // 20 Kitchen Tickets
      if (i > 30) {
        await prisma.kitchenOrder.create({
          data: {
            orderId: order.id,
            displayName: `K-${order.orderRef}`,
            tableName: tables[i % tables.length].name,
            status: i % 2 === 0 ? 'new' : 'preparing',
            items: {
              create: orderLinesData.map(ol => ({
                productId: ol.productId,
                qty: ol.qty,
                status: 'pending'
              }))
            }
          }
        });
      }
    }
  }

  console.log('Seed completed!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
