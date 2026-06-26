'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface Order { id: string; orderRef: string; total: number; status: string; table?: { name: string }; employee: { name: string }; orderDate: string; }

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(d => d.success && setOrders(d.data.orders));
  }, []);

  const statusColors: Record<string, string> = { DRAFT: 'bg-background text-secondary-text', CONFIRMED: 'bg-primary/10 text-primary', PREPARING: 'bg-warning/10 text-warning', READY: 'bg-success/10 text-success', PAID: 'bg-primary/10 text-primary', CANCELLED: 'bg-danger/10 text-danger' };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-[#2B1D15] mb-6">Orders</h1>
        <div className="bg-surface rounded-lg shadow border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-background"><tr>{['Ref', 'Table', 'Employee', 'Total', 'Status', 'Date'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-secondary-text uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-background">
                  <td className="px-6 py-4 font-medium text-[#2B1D15]">{order.orderRef}</td>
                  <td className="px-6 py-4 text-secondary-text">{order.table?.name || '-'}</td>
                  <td className="px-6 py-4 text-secondary-text">{order.employee.name}</td>
                  <td className="px-6 py-4 text-[#2B1D15]">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || ''}`}>{order.status}</span></td>
                  <td className="px-6 py-4 text-sm text-secondary-text">{new Date(order.orderDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}