'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  department: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAuthenticated: boolean;
  effectiveRole: string | null;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

const roleDepartmentMap: Record<string, string> = {
  ADMIN: 'Management',
  CASHIER: 'Cashier',
  KITCHEN_STAFF: 'Kitchen',
  KITCHEN: 'Kitchen',
  BILLING: 'Billing',
};

export function getEffectiveRole(role: string, department: string): string {
  if (role === 'ADMIN') return 'ADMIN';
  const dept = department?.toLowerCase() || '';
  if (dept === 'cashier') return 'CASHIER';
  if (dept === 'kitchen') return 'KITCHEN';
  if (dept === 'billing') return 'BILLING';
  if (role === 'KITCHEN_STAFF' || role === 'KITCHEN') return 'KITCHEN';
  if (role === 'BILLING') return 'BILLING';
  if (role === 'CASHIER') return 'CASHIER';
  return role;
}

export function getRedirectPath(role: string, department: string): string {
  const effective = getEffectiveRole(role, department);
  switch (effective) {
    case 'ADMIN': return '/dashboard';
    case 'CASHIER': return '/pos';
    case 'KITCHEN': return '/kitchen';
    case 'BILLING': return '/payments';
    default: return '/dashboard';
  }
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: async () => ({ success: false }),
  logout: () => {},
  isAuthenticated: false,
  effectiveRole: null,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [effectiveRole, setEffectiveRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token === 'mock-jwt-token') {
      clearSession();
      return;
    }
    const stored = localStorage.getItem('user');
    if (stored && token) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
        setEffectiveRole(getEffectiveRole(parsed.role, parsed.department));
      } catch {
        clearSession();
      }
    }
  }, []);

  function clearSession() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    localStorage.removeItem('department');
    document.cookie = 'accessToken=; path=/; max-age=0; SameSite=Strict';
    document.cookie = 'userRole=; path=/; max-age=0; SameSite=Strict';
  }

  function setSession(accessToken: string, userData: User) {
    const effective = getEffectiveRole(userData.role, userData.department);
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('role', effective);
    localStorage.setItem('department', userData.department);
    document.cookie = `accessToken=${accessToken}; path=/; max-age=86400; SameSite=Strict`;
    document.cookie = `userRole=${effective}; path=/; max-age=86400; SameSite=Strict`;
    setUser(userData);
    setEffectiveRole(effective);
  }

  const DEMO_ACCOUNTS = [
    { email: 'admin@odfe.local', password: 'Admin@123', name: 'Administrator', role: 'ADMIN', department: 'Management' },
    { email: 'cashier1@odfe.local', password: 'Cashier@123', name: 'Cashier', role: 'CASHIER', department: 'Cashier' },
    { email: 'kitchen@odfe.local', password: 'Kitchen@123', name: 'Kitchen', role: 'KITCHEN', department: 'Kitchen' },
    { email: 'billing@odfe.local', password: 'Billing@123', name: 'Billing', role: 'BILLING', department: 'Billing' },
  ];

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      if (res.status >= 500) {
        throw new Error('Server error');
      }
      const data = await res.json();
      if (data.success) {
        const apiUser = data.data.user;
        const userData: User = {
          id: apiUser.id,
          name: [apiUser.firstName, apiUser.lastName].filter(Boolean).join(' ') || apiUser.email,
          email: apiUser.email,
          role: apiUser.role,
          department: apiUser.department || roleDepartmentMap[apiUser.role] || '',
        };
        setSession(data.data.accessToken, userData);
        return { success: true };
      }
      return { success: false, error: data.error || data.message || 'Invalid email or password' };
    } catch {
      // Fallback to static demo accounts when backend is unreachable or has server error
      const account = DEMO_ACCOUNTS.find(a => a.email === email && a.password === password);
      if (account) {
        const userData: User = {
          id: `demo-${account.role.toLowerCase()}`,
          name: account.name,
          email: account.email,
          role: account.role,
          department: account.department,
        };
        const rolePayload = btoa(JSON.stringify({ role: account.role }));
        setSession(`dev-jwt-token.${rolePayload}.signature`, userData);
        return { success: true };
      }
      return { success: false, error: 'Invalid email or password' };
    }
  };

  const logout = () => {
    // Call backend to revoke refresh token
    fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    }).catch(() => { /* ignore network errors */ });
    clearSession();
    window.location.href = '/';
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user, effectiveRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
