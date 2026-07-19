'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Coffee, Mail, Loader2, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) { setError('Enter your email'); return; }
    setIsLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/request-password-reset`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) setMessage('If the email exists, a reset link has been sent.');
      else setError(data.error || 'Something went wrong');
    } catch { setError('Server error'); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F8F4EA] py-12">
      <div className="bg-white rounded-2xl shadow-sm-xl w-full max-w-md p-8 border border-[#E7DDCF]">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Coffee size={28} className="text-[#A56A2B]" />
            <h1 className="text-3xl font-bold text-[#2C1810]">ODFE</h1>
          </div>
          <p className="text-[#6B5B4F] mt-2">Reset your password</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#2C1810] mb-1">Email</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-[#6B5B4F]" />
              </div>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full pl-10 pr-3 py-2.5 border border-[#E7DDCF] rounded-3xl shadow-sm focus:ring-[#A56A2B] focus:border-[#A56A2B] text-sm text-[#2C1810] bg-[#F8F4EA]" placeholder="you@example.com" required />
            </div>
          </div>
          {message && <div className="bg-green-50 border border-green-200 text-[#16A34A] px-4 py-3 rounded-3xl text-sm">{message}</div>}
          {error && <div className="bg-red-50 border border-red-200 text-[#DC2626] px-4 py-3 rounded-3xl text-sm">{error}</div>}
          <button type="submit" disabled={isLoading} className="w-full bg-[#A56A2B] text-white rounded-3xl py-2.5 px-4 hover:bg-[#8B5A2B] transition disabled:opacity-70 flex items-center justify-center gap-2">
            {isLoading ? <><Loader2 className="animate-spin h-5 w-5" /> Sending...</> : 'Send Reset Link'}
          </button>
        </form>
        <div className="mt-6 text-center">
          <Link href="/login" className="inline-flex items-center gap-1 text-sm text-[#A56A2B] hover:text-[#8B5A2B]">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
