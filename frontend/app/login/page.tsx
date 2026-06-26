'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [capsLock, setCapsLock] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        redirectBasedOnRole(user.role);
      } catch (e) {
        console.error(e);
      }
    }

    const checkCapsLock = (e: KeyboardEvent) => {
      if (e.getModifierState) {
        setCapsLock(e.getModifierState('CapsLock'));
      }
    };
    
    window.addEventListener('keydown', checkCapsLock);
    window.addEventListener('keyup', checkCapsLock);
    
    return () => {
      window.removeEventListener('keydown', checkCapsLock);
      window.removeEventListener('keyup', checkCapsLock);
    };
  }, []);

  const redirectBasedOnRole = (role: string) => {
    if (role === 'ADMIN') router.push('/dashboard');
    else if (role === 'CASHIER' || role === 'order_manager') router.push('/pos');
    else if (role === 'KITCHEN_STAFF') router.push('/kitchen');
    else router.push('/payments'); 
  };

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

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });
      
      const data = await res.json();
      
      if (data.success) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        document.cookie = `accessToken=${data.data.accessToken}; path=/; max-age=86400; SameSite=Strict`;
        document.cookie = `userRole=${data.data.user.role}; path=/; max-age=86400; SameSite=Strict`;
        
        redirectBasedOnRole(data.data.user.role);
      } else {
        setError(data.error || data.message || 'Invalid Email or Password');
        setIsLoading(false);
      }
    } catch {
      setError('Network error. Could not connect to the server.');
      setIsLoading(false);
    }
  };

  const demoAccounts = [
    { name: 'Administrator', email: 'admin@odfe.local', pass: 'Admin@123', role: 'ADMIN', dept: 'Management' },
    { name: 'Cashier', email: 'cashier1@odfe.local', pass: 'Cashier@123', role: 'EMPLOYEE', dept: 'Cashier' },
    { name: 'Kitchen', email: 'kitchen@odfe.local', pass: 'Kitchen@123', role: 'EMPLOYEE', dept: 'Kitchen' },
    { name: 'Billing', email: 'billing@odfe.local', pass: 'Billing@123', role: 'EMPLOYEE', dept: 'Billing' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 p-4 py-12">
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-start">
        
        {/* LOGIN FORM */}
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900">ODFE Cafe POS</h1>
            <p className="text-gray-500 mt-2">Sign in to your account</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                  placeholder="admin@odfe.local"
                  autoComplete="email"
                  required 
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm" 
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required 
                />
                <button 
                  type="button" 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                </button>
              </div>
              {capsLock && <p className="text-amber-500 text-xs mt-1">Caps Lock is ON</p>}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input 
                  id="remember-me" 
                  name="remember-me" 
                  type="checkbox" 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" 
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <Link href="/forgot-password" className="font-medium text-blue-600 hover:text-blue-500">
                  Forgot password?
                </Link>
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm" role="alert">
                {error}
              </div>
            )}
            
            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 transition-all"
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Authenticating...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>
          
          <div className="mt-6 text-center text-sm text-gray-600">
            Don't have an account? <Link href="/signup" className="font-medium text-blue-600 hover:text-blue-500">Sign up</Link>
          </div>
        </div>

        {/* DEMO ACCOUNTS SECTION */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 h-full flex flex-col border border-white/20">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Demo Accounts</h2>
            <p className="text-blue-100 mt-1 text-sm">Use these credentials to test different roles and RBAC workflows.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {demoAccounts.map((acc, i) => (
              <div key={i} className="bg-white/90 rounded-xl p-4 shadow flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-gray-900 flex items-center justify-between">
                    {acc.name}
                    <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-medium">{acc.role}</span>
                  </h3>
                  <div className="mt-3 space-y-1 text-sm text-gray-600">
                    <p><span className="font-medium text-gray-500 inline-block w-14">Email:</span> {acc.email}</p>
                    <p><span className="font-medium text-gray-500 inline-block w-14">Pass:</span> {acc.pass}</p>
                    <p><span className="font-medium text-gray-500 inline-block w-14">Dept:</span> {acc.dept}</p>
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={() => fillDemoCredentials(acc.email, acc.pass)}
                  className="mt-4 w-full bg-gray-100 hover:bg-indigo-50 text-indigo-700 hover:text-indigo-800 border border-gray-200 hover:border-indigo-200 font-medium py-1.5 px-3 rounded-lg text-sm transition-colors"
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
