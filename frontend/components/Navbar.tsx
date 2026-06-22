'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/pos', label: 'POS', icon: '💳' },
  { href: '/orders', label: 'Orders', icon: '📋' },
  { href: '/kitchen', label: 'Kitchen', icon: '🍳' },
  { href: '/payments', label: 'Payments', icon: '💰' },
  { href: '/products', label: 'Products', icon: '☕' },
  { href: '/tables', label: 'Tables', icon: '🪑' },
  { href: '/customers', label: 'Customers', icon: '👤' },
  { href: '/employees', label: 'Employees', icon: '👥' },
  { href: '/bookings', label: 'Bookings', icon: '📅' },
  { href: '/coupons', label: 'Coupons', icon: '🏷️' },
  { href: '/reports', label: 'Reports', icon: '📈' },
  { href: '/settings', label: 'Settings', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      <div className="p-4 border-b border-gray-700">
        <h1 className="text-xl font-bold">ODFE Cafe POS</h1>
      </div>
      <nav className="flex-1 overflow-auto p-2">
        {navItems.map(item => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition ${isActive ? 'bg-blue-600 text-white' : 'text-gray-300 hover:bg-gray-800'}`}>
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-800 rounded-lg transition">Logout</button>
      </div>
    </div>
  );
}
