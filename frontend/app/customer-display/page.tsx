'use client';
import { useState } from 'react';

export default function CustomerDisplayPage() {
  const [orderId, setOrderId] = useState('');
  const [order, setOrder] = useState<{ order_ref: string; status: string; items: { name: string; qty: number; status: string }[] } | null>(null);

  const fetchOrder = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customer-display/${orderId}`);
    const data = await res.json();
    if (data.success) setOrder(data.data);
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-8">Customer Display</h1>
        <input type="text" value={orderId} onChange={e => setOrderId(e.target.value)} placeholder="Order ID" className="px-4 py-2 text-black rounded mb-4" />
        <button onClick={fetchOrder} className="bg-white text-black px-4 py-2 rounded ml-2">View</button>
        {order && (
          <div className="mt-8">
            <h2 className="text-2xl">Order: {order.order_ref}</h2>
            <p className="text-xl text-green-400">{order.status}</p>
            {order.items.map((item, i) => <p key={i} className="text-lg">{item.qty}x {item.name} - {item.status}</p>)}
          </div>
        )}
      </div>
    </div>
  );
}
