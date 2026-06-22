'use client';
import { useState, useEffect } from 'react';

interface Product { id: string; name: string; price: number; }
interface CartItem { productId: string; name: string; qty: number; price: number; }

export default function SelfOrderPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [token, setToken] = useState('');

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
      body: JSON.stringify({ token, items: cart.map(i => ({ product_id: i.productId, qty: i.qty, price: i.price })) }),
    });
    const data = await res.json();
    if (data.success) alert(`Order placed: ${data.data.orderRef}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-400 to-red-500 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">ODFE Cafe - Self Order</h1>
        <div className="grid grid-cols-2 gap-4 mb-8">
          {products.map(p => (
            <button key={p.id} onClick={() => addToCart(p)} className="bg-white rounded-lg p-4 text-left hover:shadow-lg transition">
              <p className="font-semibold">{p.name}</p>
              <p className="text-orange-500 font-bold">${p.price.toFixed(2)}</p>
            </button>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="bg-white rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Your Order</h2>
            {cart.map(i => <div key={i.productId} className="flex justify-between py-1"><span>{i.qty}x {i.name}</span><span>${(i.qty * i.price).toFixed(2)}</span></div>)}
            <p className="text-xl font-bold mt-4">Total: ${cart.reduce((s, i) => s + i.qty * i.price, 0).toFixed(2)}</p>
            <button onClick={placeOrder} className="w-full bg-orange-500 text-white rounded-md py-3 mt-4 hover:bg-orange-600 font-bold">Place Order</button>
          </div>
        )}
      </div>
    </div>
  );
}
