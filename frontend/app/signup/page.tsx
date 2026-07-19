'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Coffee, Loader2 } from 'lucide-react';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return; }
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, role: 'ADMIN' }),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('accessToken', data.data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.data.user));
        document.cookie = `accessToken=${data.data.accessToken}; path=/; max-age=86400; SameSite=Strict`;
        document.cookie = `userRole=ADMIN; path=/; max-age=86400; SameSite=Strict`;
        window.location.href = '/dashboard';
      } else setError(data.error || data.message || 'Signup failed');
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
          <p className="text-[#6B5B4F] mt-2">Create your administrator account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#2C1810]">First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 block w-full rounded-md border border-[#E7DDCF] px-3 py-2 shadow-sm focus:border-[#A56A2B] focus:outline-none text-[#2C1810] bg-[#F8F4EA]" required minLength={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2C1810]">Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 block w-full rounded-md border border-[#E7DDCF] px-3 py-2 shadow-sm focus:border-[#A56A2B] focus:outline-none text-[#2C1810] bg-[#F8F4EA]" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C1810]">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border border-[#E7DDCF] px-3 py-2 shadow-sm focus:border-[#A56A2B] focus:outline-none text-[#2C1810] bg-[#F8F4EA]" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C1810]">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border border-[#E7DDCF] px-3 py-2 shadow-sm focus:border-[#A56A2B] focus:outline-none text-[#2C1810] bg-[#F8F4EA]" required minLength={8} />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2C1810]">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full rounded-md border border-[#E7DDCF] px-3 py-2 shadow-sm focus:border-[#A56A2B] focus:outline-none text-[#2C1810] bg-[#F8F4EA]" required />
          </div>
          {error && <p className="text-[#DC2626] text-sm">{error}</p>}
          <button type="submit" disabled={isLoading} className="w-full bg-[#A56A2B] text-white rounded-md py-2 px-4 hover:bg-[#8B5A2B] transition disabled:opacity-70 flex items-center justify-center gap-2">
            {isLoading ? <><Loader2 className="animate-spin h-5 w-5" /> Creating Account...</> : 'Sign Up'}
          </button>
        </form>
        <div className="mt-4 text-center text-sm text-[#6B5B4F]">
          Already have an account? <Link href="/login" className="text-[#A56A2B] hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
