'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface Payment { id: string; paymentRef: string; amount: number; status: string; method: { name: string }; order: { orderRef: string }; paymentDate: string; }

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => d.success && setPayments(d.data));
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-[#2B1D15] mb-6">Payments</h1>
        <div className="bg-surface rounded-lg shadow border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-background"><tr>{['Ref', 'Order', 'Method', 'Amount', 'Status', 'Date'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-secondary-text uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {payments.map(p => (
                <tr key={p.id} className="hover:bg-background">
                  <td className="px-6 py-4 font-medium text-[#2B1D15]">{p.paymentRef}</td>
                  <td className="px-6 py-4 text-[#2B1D15]">{p.order.orderRef}</td>
                  <td className="px-6 py-4 text-secondary-text">{p.method.name}</td>
                  <td className="px-6 py-4 text-[#2B1D15]">${p.amount.toFixed(2)}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${p.status === 'COMPLETED' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning'}`}>{p.status}</span></td>
                  <td className="px-6 py-4 text-sm text-secondary-text">{new Date(p.paymentDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}