'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Navbar';

interface Customer { id: string; name: string; phone: string; email: string; isVip: boolean; totalOrders: number; totalSpent: number; }

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => d.success && setCustomers(d.data));
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Customers</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>{['Name', 'Phone', 'Email', 'VIP', 'Orders', 'Spent'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-200">
              {customers.map(c => (
                <tr key={c.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{c.name}</td>
                  <td className="px-6 py-4">{c.phone || '-'}</td>
                  <td className="px-6 py-4">{c.email || '-'}</td>
                  <td className="px-6 py-4">{c.isVip ? <span className="text-yellow-500">VIP</span> : '-'}</td>
                  <td className="px-6 py-4">{c.totalOrders}</td>
                  <td className="px-6 py-4">${c.totalSpent.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
