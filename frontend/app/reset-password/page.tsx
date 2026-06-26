'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
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
      } else {
        setError(data.error || data.message || 'Failed to reset password');
      }
    } catch {
      setError('Server error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 to-indigo-800">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ODFE Cafe POS</h1>
          <p className="text-gray-500 mt-2">Enter OTP/Token to reset password</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Reset Token / OTP</label>
            <input type="text" value={token} onChange={(e) => setToken(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">New Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none" required minLength={8} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none" required />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {message && <p className="text-green-600 text-sm">{message}</p>}
          <button type="submit" className="w-full bg-blue-600 text-white rounded-md py-2 px-4 hover:bg-blue-700 transition">Reset Password</button>
        </form>
      </div>
    </div>
  );
}
