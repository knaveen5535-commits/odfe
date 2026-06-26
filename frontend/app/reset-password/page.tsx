'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Coffee, ArrowLeft, Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();
      if (data.success) {
        setMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => router.push('/login'), 2000);
      } else setError(data.error || data.message || 'Failed to reset password');
    } catch { setError('Server error'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F4EA] py-12">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 border border-[#E7DDCF]">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coffee size={28} className="text-[#A56A2B]" />
            <h1 className="text-3xl font-bold text-[#2C1810]">ODFE</h1>
          </div>
          <p className="text-[#6B5B4F] mt-2">Reset your password</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2C1810]">Reset Token / OTP</label>
            <input type="text" value={token} onChange={(e) => setToken(e.target.value)} className="mt-1 block w-full rounded-md border border-[#E7DDCF] px-3 py-2 shadow-sm focus:border-[#A56A2B] focus:outline-none text-[#2C1810] bg-[#F8F4EA]" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C1810]">New Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border border-[#E7DDCF] px-3 py-2 shadow-sm focus:border-[#A56A2B] focus:outline-none text-[#2C1810] bg-[#F8F4EA]" required minLength={8} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C1810]">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full rounded-md border border-[#E7DDCF] px-3 py-2 shadow-sm focus:border-[#A56A2B] focus:outline-none text-[#2C1810] bg-[#F8F4EA]" required />
          </div>
          {error && <p className="text-[#DC2626] text-sm">{error}</p>}
          {message && <p className="text-[#16A34A] text-sm">{message}</p>}
          <button type="submit" disabled={isLoading} className="w-full bg-[#A56A2B] text-white rounded-md py-2.5 px-4 hover:bg-[#8B5A2B] transition disabled:opacity-70 flex items-center justify-center gap-2">
            {isLoading ? <><Loader2 className="animate-spin h-5 w-5" /> Resetting...</> : 'Reset Password'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <Link href="/login" className="inline-flex items-center gap-1 text-sm text-[#A56A2B] hover:text-[#8B5A2B]">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
