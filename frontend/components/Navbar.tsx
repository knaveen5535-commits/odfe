'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Coffee, LayoutDashboard, CreditCard, LogOut, FileText, Settings, Users } from 'lucide-react';
import styles from './Navbar.module.scss';
import clsx from 'clsx';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={16} /> },
  { href: '/pos', label: 'POS', icon: <CreditCard size={16} /> },
  { href: '/orders', label: 'Orders', icon: <FileText size={16} /> },
  { href: '/customers', label: 'Customers', icon: <Users size={16} /> },
  { href: '/settings', label: 'Settings', icon: <Settings size={16} /> },
];

export default function Navbar() {
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // Do not show the top navbar on the POS screen itself, as it's a dedicated layout
  if (pathname === '/pos') return null;

  return (
    <div className={styles.navbar}>
      <Link href="/dashboard" className={styles.logo}>
        <Coffee size={24} color="var(--brown-primary)" />
        ODFE
      </Link>
      
      <nav className={styles.navLinks}>
        {navItems.map(item => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={clsx(styles.navItem, isActive && styles.active)}
            >
              {item.icon}
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.profile}>
        <button onClick={handleLogout} className={styles.logoutBtn} title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </div>
  );
}
