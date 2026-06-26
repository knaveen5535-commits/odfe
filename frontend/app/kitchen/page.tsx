'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

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
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-[#2B1D15] mb-6">Kitchen Display</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map(order => (
            <div key={order.id} className={`bg-surface rounded-lg shadow-lg p-6 border-l-4 border-border ${order.priority === 'urgent' ? 'border-danger' : 'border-warning'}`}>
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-[#2B1D15]">{order.displayName}</h2>
                <span className={`px-2 py-1 rounded text-sm ${order.status === 'new' ? 'bg-primary/10 text-primary' : order.status === 'preparing' ? 'bg-warning/10 text-warning' : 'bg-success/10 text-success'}`}>{order.status}</span>
              </div>
              <p className="text-secondary-text mb-4">Table: {order.tableName || 'N/A'}</p>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between items-center py-1 border-b border-border">
                    <span className="text-[#2B1D15]">{item.qty}x {item.productName}</span>
                    <span className={`text-sm ${item.status === 'ready' ? 'text-success' : 'text-secondary-text'}`}>{item.status}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                {order.status === 'new' && <button onClick={() => updateStatus(order.id, 'preparing')} className="flex-1 bg-warning text-white rounded py-2 hover:bg-warning/80">Start</button>}
                {order.status === 'preparing' && <button onClick={() => updateStatus(order.id, 'ready')} className="flex-1 bg-success text-white rounded py-2 hover:bg-success/80">Ready</button>}
                {order.status === 'ready' && <button onClick={() => updateStatus(order.id, 'served')} className="flex-1 bg-primary text-white rounded py-2 hover:bg-primary-hover">Served</button>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}