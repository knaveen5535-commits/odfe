'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface Customer { id: string; name: string; phone: string; email: string; isVip: boolean; totalOrders: number; totalSpent: number; }

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => d.success && setCustomers(d.data));
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-[#2B1D15] mb-6">Customers</h1>
        <div className="bg-surface rounded-lg shadow border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-background"><tr>{['Name', 'Phone', 'Email', 'VIP', 'Orders', 'Spent'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-secondary-text uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-background">
                  <td className="px-6 py-4 font-medium text-[#2B1D15]">{c.name}</td>
                  <td className="px-6 py-4 text-secondary-text">{c.phone || '-'}</td>
                  <td className="px-6 py-4 text-secondary-text">{c.email || '-'}</td>
                  <td className="px-6 py-4">{c.isVip ? <span className="text-warning font-medium">VIP</span> : '-'}</td>
                  <td className="px-6 py-4 text-secondary-text">{c.totalOrders}</td>
                  <td className="px-6 py-4 text-[#2B1D15]">${c.totalSpent.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}