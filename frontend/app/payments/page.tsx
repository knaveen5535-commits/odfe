'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Navbar';

interface Payment { id: string; paymentRef: string; amount: number; status: string; method: { name: string }; order: { orderRef: string }; paymentDate: string; }

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => d.success && setPayments(d.data));
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Payments</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>{['Ref', 'Order', 'Method', 'Amount', 'Status', 'Date'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{p.paymentRef}</td>
                  <td className="px-6 py-4">{p.order.orderRef}</td>
                  <td className="px-6 py-4">{p.method.name}</td>
                  <td className="px-6 py-4">${p.amount.toFixed(2)}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{p.status}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(p.paymentDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
