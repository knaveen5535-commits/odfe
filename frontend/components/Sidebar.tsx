'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, BarChart3, Package, ListTree, Users,
  ShoppingCart, FileText, Settings, User, LogOut, Coffee, ChefHat,
  ClipboardList, SplitSquareVertical, CreditCard, DollarSign,
  Receipt, Clock, Banknote, Smartphone, Table2, Map, QrCode,
  CheckCircle, FileClock, Ticket, Megaphone, UserCircle,
  LucideIcon,
} from 'lucide-react';
import clsx from 'clsx';

const ownerNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/orders', label: 'Orders', icon: ClipboardList },
  { href: '/tables', label: 'Tables', icon: Table2 },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/employees', label: 'Employees', icon: UserCircle },
  { href: '/payments', label: 'Payments', icon: DollarSign },
  { href: '/coupons', label: 'Coupons', icon: Ticket },
  { href: '/promotions', label: 'Promotions', icon: Megaphone },
  { href: '/kitchen', label: 'Kitchen Display', icon: ChefHat },
  { href: '/sessions', label: 'POS Sessions', icon: Clock },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/self-order', label: 'Self Ordering', icon: Smartphone },
  { href: '/settings', label: 'Settings', icon: Settings },
  { href: '/profile', label: 'Profile', icon: User },
];

const systemAdminNavItems = [
  { href: '/system/dashboard', label: 'System Admin', icon: LayoutDashboard },
  { href: '/system/tenants', label: 'Tenants/Branches', icon: Settings },
  { href: '/system/users', label: 'All Users', icon: Users },
  { href: '/system/settings', label: 'Global Settings', icon: Settings },
];

const cashierNavItems = [
  { href: '/pos', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/pos/floor', label: 'Floor View', icon: Map },
  { href: '/pos/order', label: 'Order Screen', icon: ShoppingCart },
  { href: '/pos/orders', label: 'Orders', icon: ClipboardList },
  { href: '/pos/customers', label: 'Customers', icon: Users },
  { href: '/pos/payments', label: 'Payments', icon: DollarSign },
  { href: '/pos/session', label: 'Session', icon: Clock },
  { href: '/profile', label: 'Profile', icon: User },
];

const kitchenNavItems = [
  { href: '/kitchen?status=to-cook', label: 'To Cook', icon: Clock },
  { href: '/kitchen?status=preparing', label: 'Preparing', icon: ChefHat },
  { href: '/kitchen?status=completed', label: 'Completed', icon: CheckCircle },
  { href: '/kitchen/history', label: 'History', icon: FileClock },
];



export default function Sidebar() {
  const pathname = usePathname();
  const { user, effectiveRole, logout } = useAuth();

  let navItems: { href: string; label: string; icon: LucideIcon }[] = [];

  switch (effectiveRole) {
    case 'OWNER':
      navItems = ownerNavItems;
      break;
    case 'SYSTEM_ADMIN':
      navItems = systemAdminNavItems;
      break;
    case 'CASHIER':
      navItems = cashierNavItems;
      break;
    case 'KITCHEN':
      navItems = kitchenNavItems;
      break;
    default:
      navItems = [];
  }

  return (
    <aside className="w-64 bg-white border-r border-border flex flex-col h-screen sticky top-0">
      <div className="p-5 border-b border-border">
        <Link href={effectiveRole === 'OWNER' ? '/dashboard' : effectiveRole === 'SYSTEM_ADMIN' ? '/system/dashboard' : effectiveRole === 'CASHIER' ? '/pos' : '/kitchen'} className="flex items-center gap-2">
          <Coffee size={24} className="text-primary" />
          <span className="text-lg font-bold text-[#2B1D15]">ODFE</span>
        </Link>
      </div>

      {user && (
        <div className="px-5 py-3 border-b border-border bg-[#F8F4EA]/50">
          <p className="text-sm font-medium text-[#2B1D15] truncate">{user.name}</p>
          <p className="text-xs text-secondary-text truncate">{user.department}</p>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (pathname?.startsWith(item.href.split('?')[0] + '/'));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={clsx(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors',
                isActive
                  ? 'bg-[#F8F4EA] text-primary font-medium'
                  : 'text-secondary-text hover:bg-[#F8F4EA] hover:text-[#2B1D15]',
              )}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-secondary-text hover:bg-red-50 hover:text-danger w-full transition-colors"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </aside>
  );
}
