'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Navbar';

interface Order { id: string; orderRef: string; total: number; status: string; table?: { name: string }; employee: { name: string }; orderDate: string; }

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(d => d.success && setOrders(d.data.orders));
  }, []);

  const statusColors: Record<string, string> = { DRAFT: 'bg-gray-100 text-gray-800', CONFIRMED: 'bg-blue-100 text-blue-800', PREPARING: 'bg-yellow-100 text-yellow-800', READY: 'bg-green-100 text-green-800', PAID: 'bg-purple-100 text-purple-800', CANCELLED: 'bg-red-100 text-red-800' };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Orders</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>{['Ref', 'Table', 'Employee', 'Total', 'Status', 'Date'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-200">
              {orders.map(order => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{order.orderRef}</td>
                  <td className="px-6 py-4">{order.table?.name || '-'}</td>
                  <td className="px-6 py-4">{order.employee.name}</td>
                  <td className="px-6 py-4">${order.total.toFixed(2)}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColors[order.status] || ''}`}>{order.status}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(order.orderDate).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
