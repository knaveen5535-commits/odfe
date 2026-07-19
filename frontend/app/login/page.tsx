'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2, Coffee } from 'lucide-react';
import { useAuth, getRedirectPath } from '@/context/AuthContext';

const DEMO_ACCOUNTS = [
  { name: 'Admin', email: 'admin@odfe.local', pass: 'Admin@123', role: 'ADMIN', dept: 'Management' },
  { name: 'Employee POS', email: 'pos@odfe.local', pass: 'Pos@123', role: 'CASHIER', dept: 'Cashier' },
  { name: 'Kitchen Dashboard', email: 'kitchen@odfe.local', pass: 'Kitchen@123', role: 'KITCHEN_STAFF', dept: 'Kitchen' },
];

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  useEffect(() => {
    const checkCapsLock = (e: KeyboardEvent) => {
      if (e.getModifierState) setCapsLock(e.getModifierState('CapsLock'));
    };
    window.addEventListener('keydown', checkCapsLock);
    window.addEventListener('keyup', checkCapsLock);
    return () => {
      window.removeEventListener('keydown', checkCapsLock);
      window.removeEventListener('keyup', checkCapsLock);
    };
  }, []);

  const fillDemoCredentials = (e: string, p: string) => {
    setEmail(e);
    setPassword(p);
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    setIsLoading(true);
    setError('');
    const result = await login(email, password);
    if (result.success) {
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          router.push(getRedirectPath(user.role, user.department));
          return;
        }
      } catch {
        // fall through to error
      }
      setError('Failed to retrieve user session.');
    } else {
      setError(result.error || 'Invalid email or password.');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F4EA] p-4 py-12">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-start">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Coffee size={28} className="text-[#A56A2B]" />
              <h1 className="text-3xl font-bold text-[#2C1810]">ODFE</h1>
            </div>
            <p className="text-[#6B5B4F] mt-2">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#2C1810] mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-[#6B5B4F]" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2.5 border border-[#E7DDCF] rounded-lg shadow-sm focus:ring-[#A56A2B] focus:border-[#A56A2B] text-sm text-[#2C1810] placeholder-[#6B5B4F] bg-[#F8F4EA]"
                  placeholder="admin@odfe.local"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#2C1810] mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-[#6B5B4F]" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2.5 border border-[#E7DDCF] rounded-lg shadow-sm focus:ring-[#A56A2B] focus:border-[#A56A2B] text-sm text-[#2C1810] placeholder-[#6B5B4F] bg-[#F8F4EA]"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                />
                <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff className="h-5 w-5 text-[#6B5B4F] hover:text-[#A56A2B]" /> : <Eye className="h-5 w-5 text-[#6B5B4F] hover:text-[#A56A2B]" />}
                </button>
              </div>
              {capsLock && <p className="text-[#D97706] text-xs mt-1">Caps Lock is ON</p>}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-[#A56A2B] focus:ring-[#A56A2B] border-[#E7DDCF] rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#2C1810]">Remember me</label>
              </div>
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-[#A56A2B] hover:text-[#8B5A2B]">Forgot password?</Link>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-[#DC2626] px-4 py-3 rounded-lg text-sm" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#A56A2B] hover:bg-[#8B5A2B] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A56A2B] disabled:opacity-70 transition-all"
            >
              {isLoading ? (
                <><Loader2 className="animate-spin h-5 w-5 mr-2" /> Authenticating...</>
              ) : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-[#6B5B4F]">
            Don't have an account? <Link href="/signup" className="font-medium text-[#A56A2B] hover:text-[#8B5A2B]">Sign up</Link>
          </div>
        </div>

        <div className="bg-[#A56A2B]/10 backdrop-blur-md rounded-2xl p-6 h-full flex flex-col border border-[#E7DDCF]">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-[#2C1810]">Demo Accounts</h2>
            <p className="text-[#6B5B4F] mt-1 text-sm">Use these credentials to test different roles and RBAC workflows.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {DEMO_ACCOUNTS.map((acc, i) => (
              <div key={i} className="bg-white rounded-xl p-4 shadow flex flex-col justify-between border border-[#E7DDCF]">
                <div>
                  <h3 className="font-bold text-[#2C1810] flex items-center justify-between">
                    {acc.name}
                    <span className="text-xs bg-[#A56A2B]/10 text-[#A56A2B] px-2 py-0.5 rounded-full font-medium">{acc.role}</span>
                  </h3>
                  <div className="mt-3 space-y-1 text-sm text-[#6B5B4F]">
                    <p><span className="font-medium text-[#2C1810] inline-block w-14">Email:</span> {acc.email}</p>
                    <p><span className="font-medium text-[#2C1810] inline-block w-14">Pass:</span> {acc.pass}</p>
                    <p><span className="font-medium text-[#2C1810] inline-block w-14">Dept:</span> {acc.dept}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => fillDemoCredentials(acc.email, acc.pass)}
                  className="mt-4 w-full bg-[#F8F4EA] hover:bg-[#E7DDCF] text-[#A56A2B] border border-[#E7DDCF] font-medium py-1.5 px-3 rounded-lg text-sm transition-colors"
                >
                  Use Credentials
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
