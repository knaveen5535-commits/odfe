'use client';
import { useState } from 'react';
import { Coffee } from 'lucide-react';

export default function CustomerDisplayPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<{ order_ref: string; status: string; items: { name: string; qty: number; status: string }[] } | null>(null);

  const fetchOrder = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer-display/${orderId}`);
    const data = await res.json();
    if (data.success) setOrder(data.data);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-8">
      <div className="max-w-lg w-full text-center">
        <div className="flex items-center justify-center gap-2 mb-8">
          <Coffee size={32} className="text-primary" />
          <h1 className="text-3xl font-bold text-[#2B1D15]">ODFE Cafe</h1>
        </div>
        <p className="text-secondary-text mb-6">Customer Order Display</p>
        <div className="flex gap-2 mb-8">
          <input type="text" value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="Enter Order ID" className="flex-1 px-4 py-2 border border-border rounded-lg bg-surface text-[#2B1D15]" />
          <button onClick={fetchOrder} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary-hover transition">View</button>
        </div>
        {order && (
          <div className="bg-surface rounded-xl p-8 border border-border">
            <h2 className="text-2xl font-bold text-[#2B1D15]">Order: {order.order_ref}</h2>
            <p className="text-lg text-success mt-2">{order.status}</p>
            <div className="mt-6 space-y-3">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between items-center py-2 border-b border-border">
                  <span className="text-lg text-[#2B1D15]">{item.qty}x {item.name}</span>
                  <span className="text-secondary-text">{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}