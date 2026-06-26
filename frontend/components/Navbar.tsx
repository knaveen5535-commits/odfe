'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Coffee, LogOut } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { effectiveRole, logout } = useAuth();

  if (pathname === '/pos') return null;

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="bg-white border-b border-border px-6 py-3 flex items-center justify-between sticky top-0 z-50">
      <Link
        href={
          effectiveRole === 'ADMIN' ? '/dashboard' :
          effectiveRole === 'CASHIER' ? '/pos' :
          effectiveRole === 'KITCHEN' ? '/kitchen' :
          effectiveRole === 'BILLING' ? '/payments' :
          '/dashboard'
        }
        className="flex items-center gap-2"
      >
        <Coffee size={24} className="text-primary" />
        <span className="text-lg font-bold text-[#2B1D15]">ODFE</span>
      </Link>
      <div className="flex items-center gap-4">
        <button onClick={handleLogout} className="flex items-center gap-2 text-secondary-text hover:text-primary transition-colors text-sm font-medium">
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
}