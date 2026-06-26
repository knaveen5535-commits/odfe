'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      redirectBasedOnRole(user.role);
    }
  }, []);

  const redirectBasedOnRole = (role: string) => {
    if (role === 'ADMIN') router.push('/dashboard');
    else if (role === 'CASHIER') router.push('/pos');
    else if (role === 'KITCHEN_STAFF') router.push('/kitchen');
    else router.push('/payments'); 
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName }),
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
        setError(data.error || data.message || 'Signup failed');
      }
    } catch {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800 py-12">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ODFE Cafe POS</h1>
          <p className="text-gray-500 mt-2">Create your business account</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none" required minLength={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none" required />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none" required minLength={8} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none" required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition">Sign Up</button>
        </form>
        <div className="mt-4 text-center text-sm text-gray-600">
          Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Sign In</Link>
        </div>
      </div>
    </div>
  );
}
