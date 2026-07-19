'use client';
import { useState, useEffect } from 'react';
import { Coffee } from 'lucide-react';

interface Product { id: string; name: string; price: number; }
interface CartItem { productId: string; name: string; qty: number; price: number; }

export default function SelfOrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/self-order/menu`)
      .then(r => r.json()).then(d => d.success && setProducts(d.data.products));
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) return prev.map(i => i.productId === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { productId: product.id, name: product.name, qty: 1, price: product.price }];
    });
  };

  const placeOrder = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/self-order/place-order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items: cart.map(i => ({ product_id: i.productId, qty: i.qty, price: i.price })) }),
    });
    const data = await res.json();
    if (data.success) alert(`Order placed: ${data.data.orderRef}`);
  };

  return (
    <div className="min-h-screen bg-[#F8F4EA]">
      <div className="max-w-4xl mx-auto p-8">
        <div className="flex items-center gap-2 mb-8">
          <Coffee size={28} className="text-[#A56A2B]" />
          <h1 className="text-3xl font-bold text-[#2C1810]">ODFE Cafe</h1>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {products.map(p => (
            <button key={p.id} onClick={() => addToCart(p)} className="bg-white rounded-3xl p-4 text-left border border-[#E7DDCF] hover:shadow-sm-lg transition">
              <p className="font-semibold text-[#2C1810]">{p.name}</p>
              <p className="text-[#A56A2B] font-bold">${p.price.toFixed(2)}</p>
            </button>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="bg-white rounded-3xl p-6 border border-[#E7DDCF]">
            <h2 className="text-xl font-bold text-[#2C1810] mb-4">Your Order</h2>
            {cart.map(i => <div key={i.productId} className="flex justify-between py-1 text-[#2C1810]"><span>{i.qty}x {i.name}</span><span>${(i.qty * i.price).toFixed(2)}</span></div>)}
            <p className="text-xl font-bold mt-4 text-[#2C1810]">Total: ${cart.reduce((s, i) => s + i.qty * i.price, 0).toFixed(2)}</p>
            <button onClick={placeOrder} className="w-full bg-[#A56A2B] text-white rounded-md py-3 mt-4 hover:bg-[#A56A2B]-hover font-bold transition">Place Order</button>
          </div>
        )}
      </div>
    </div>
  );
}