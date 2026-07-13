'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { ChefHat, Clock, AlertTriangle, CheckCircle, UtensilsCrossed } from 'lucide-react';

interface KitchenItem { id: string; productName: string; qty: number; status: string; }
interface KitchenOrder { id: string; displayName: string; tableName: string; status: string; priority: string; items: KitchenItem[]; timestamp?: string; }

export default function KitchenPage() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = () => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/kitchen/orders?status=new,preparing,ready`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(d => {
      if (d.success) setOrders(d.data);
      setLoading(false);
    }).catch(() => setLoading(false));
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

  const getStatusColor = (status: string) => {
    if (status === 'new') return 'bg-amber-100 text-amber-700 border-amber-300';
    if (status === 'preparing') return 'bg-blue-100 text-blue-700 border-blue-300';
    if (status === 'ready') return 'bg-emerald-100 text-emerald-700 border-emerald-300';
    return 'bg-gray-100 text-gray-700 border-gray-300';
  };

  return (
    <div className="flex h-screen bg-[#F8F4EA] font-sans">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-[#A56A2B] p-3 rounded-2xl shadow-lg shadow-[#A56A2B]/30 text-white">
              <ChefHat size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-[#2C1810]">Kitchen Display</h1>
              <p className="text-[#6B5B4F] font-medium">Live Order Tracking & Management</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-white">
              <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
              <span className="text-sm font-bold text-[#2C1810]">New: {orders.filter(o => o.status === 'new').length}</span>
            </div>
            <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-white">
              <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></div>
              <span className="text-sm font-bold text-[#2C1810]">Prep: {orders.filter(o => o.status === 'preparing').length}</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1,2,3,4].map(i => <div key={i} className="animate-pulse bg-white rounded-3xl h-80 shadow-sm border border-white"></div>)}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {orders.map(order => (
              <div key={order.id} className={`relative flex flex-col bg-white rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-shadow border-t-8 ${order.priority === 'urgent' ? 'border-t-red-500' : order.status === 'new' ? 'border-t-amber-500' : 'border-t-blue-500'}`}>
                {order.priority === 'urgent' && (
                  <div className="absolute top-4 right-4 animate-bounce">
                    <AlertTriangle className="text-red-500" size={24} />
                  </div>
                )}
                
                <div className="p-6 pb-4 border-b border-gray-100 bg-gray-50/50">
                  <div className="flex justify-between items-start mb-2">
                    <h2 className="text-2xl font-black text-[#2C1810]">{order.displayName}</h2>
                  </div>
                  <div className="flex items-center gap-3 text-sm font-bold text-[#6B5B4F]">
                    <span className="flex items-center gap-1"><UtensilsCrossed size={16} /> {order.tableName || 'Takeaway'}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock size={16} /> 5m ago</span>
                  </div>
                </div>

                <div className="p-6 flex-1 overflow-y-auto">
                  <div className="space-y-3">
                    {order.items.map(item => (
                      <div key={item.id} className="flex justify-between items-center p-3 rounded-xl bg-[#F8F4EA]/50 border border-[#E7DDCF] hover:bg-[#F8F4EA] transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="bg-[#A56A2B] text-white font-black px-2.5 py-1 rounded-lg text-sm">{item.qty}x</span>
                          <span className="font-bold text-[#2C1810] text-lg">{item.productName}</span>
                        </div>
                        {item.status === 'ready' && <CheckCircle className="text-emerald-500" size={20} />}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-gray-50 border-t border-gray-100 mt-auto">
                  {order.status === 'new' && (
                    <button onClick={() => updateStatus(order.id, 'preparing')} className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold text-lg rounded-xl py-3.5 shadow-lg shadow-blue-500/30 hover:scale-[1.02] active:scale-95 transition-all">
                      Start Preparing
                    </button>
                  )}
                  {order.status === 'preparing' && (
                    <button onClick={() => updateStatus(order.id, 'ready')} className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold text-lg rounded-xl py-3.5 shadow-lg shadow-emerald-500/30 hover:scale-[1.02] active:scale-95 transition-all">
                      Mark as Ready
                    </button>
                  )}
                  {order.status === 'ready' && (
                    <button onClick={() => updateStatus(order.id, 'served')} className="w-full bg-gradient-to-r from-[#A56A2B] to-[#8B5A2B] text-white font-bold text-lg rounded-xl py-3.5 shadow-lg shadow-[#A56A2B]/30 hover:scale-[1.02] active:scale-95 transition-all">
                      Order Served
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {orders.length === 0 && !loading && (
              <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#6B5B4F]">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 text-gray-300">
                  <ChefHat size={48} />
                </div>
                <h3 className="text-2xl font-bold text-[#2C1810] mb-2">No active orders</h3>
                <p>The kitchen is all caught up! Great job team.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}