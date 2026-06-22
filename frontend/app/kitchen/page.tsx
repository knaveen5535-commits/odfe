'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Navbar';

interface KitchenItem { id: string; productName: string; qty: number; status: string; }
interface KitchenOrder { id: string; displayName: string; tableName: string; status: string; priority: string; items: KitchenItem[]; }

export default function KitchenPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);

  const fetchOrders = () => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/kitchen/orders?status=new,preparing,ready`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(d => d.success && setOrders(d.data));
  };

  useEffect(() => { fetchOrders(); const id = setInterval(fetchOrders, 10000); return () => clearInterval(id); }, []);

  const updateStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('accessToken');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/kitchen/orders/${id}/status`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    fetchOrders();
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Kitchen Display</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <div key={order.id} className={`bg-white rounded-lg shadow-lg p-6 border-l-4 ${order.priority === 'urgent' ? 'border-red-500' : 'border-yellow-500'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{order.displayName}</h2>
                <span className={`px-2 py-1 rounded text-sm ${order.status === 'new' ? 'bg-blue-100 text-blue-800' : order.status === 'preparing' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>{order.status}</span>
              </div>
              <p className="text-gray-500 mb-4">Table: {order.tableName || 'N/A'}</p>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-1 border-b">
                    <span>{item.qty}x {item.productName}</span>
                    <span className={`text-sm ${item.status === 'ready' ? 'text-green-600' : 'text-gray-400'}`}>{item.status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                {order.status === 'new' && <button onClick={() => updateStatus(order.id, 'preparing')} className="flex-1 bg-yellow-500 text-white rounded py-2 hover:bg-yellow-600">Start</button>}
                {order.status === 'preparing' && <button onClick={() => updateStatus(order.id, 'ready')} className="flex-1 bg-green-500 text-white rounded py-2 hover:bg-green-600">Ready</button>}
                {order.status === 'ready' && <button onClick={() => updateStatus(order.id, 'served')} className="flex-1 bg-blue-500 text-white rounded py-2 hover:bg-blue-600">Served</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
