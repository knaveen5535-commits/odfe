'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard, BarChart3, Package, ListTree, Users,
  ShoppingCart, FileText, Settings, User, LogOut, Coffee, ChefHat,
  ClipboardList, SplitSquareVertical, CreditCard, DollarSign,
  Receipt, Clock, Banknote, Smartphone, Table2, Map, LucideIcon,
} from 'lucide-react';
import clsx from 'clsx';

const adminNavItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/products', label: 'Products', icon: Package },
  { href: '/categories', label: 'Categories', icon: ListTree },
  { href: '/employees', label: 'Employees', icon: Users },
  { href: '/customers', label: 'Customers', icon: ShoppingCart },
  { href: '/reports', label: 'Reports', icon: FileText },
  { href: '/settings', label: 'Settings', icon: Settings },
];

const cashierNavItems = [
  { href: '/pos', label: 'POS', icon: CreditCard },
  { href: '/tables', label: 'Tables', icon: Table2 },
  { href: '/orders', label: 'Orders', icon: ClipboardList },
  { href: '/customers', label: 'Customers', icon: Users },
  { href: '/payments', label: 'Payments', icon: DollarSign },
  { href: '/split-bill', label: 'Split Bill', icon: SplitSquareVertical },
  { href: '/receipt', label: 'Receipts', icon: Receipt },
  { href: '/payment-history', label: 'Billing History', icon: FileText },
];

const kitchenNavItems = [
  { href: '/kitchen', label: 'Kitchen Display', icon: ChefHat },
  { href: '/kitchen?status=to-cook', label: 'To Cook', icon: Clock },
  { href: '/kitchen?status=preparing', label: 'Preparing', icon: ChefHat },
  { href: '/kitchen?status=ready', label: 'Ready', icon: Package },
  { href: '/kitchen?status=completed', label: 'Completed', icon: ClipboardList },
];



export default function Sidebar() {
  const pathname = usePathname();
  const { user, effectiveRole, logout } = useAuth();

  let navItems: { href: string; label: string; icon: LucideIcon }[] = [];

  switch (effectiveRole) {
    case 'ADMIN':
      navItems = adminNavItems;
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
        <Link href={effectiveRole === 'ADMIN' ? '/dashboard' : effectiveRole === 'CASHIER' ? '/pos' : '/kitchen'} className="flex items-center gap-2">
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
