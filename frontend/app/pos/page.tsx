'use client';
import { useState, useEffect } from 'react';
import Sidebar from '@/components/Navbar';

interface Product { id: string; name: string; salePrice: number; categoryId: string; }
interface CartItem { productId: string; name: string; qty: number; price: number; }

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCat, setSelectedCat] = useState<string>('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${token}` };
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { headers })
      .then(r => r.json()).then(d => d.success && setProducts(d.data));
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { headers })
      .then(r => r.json()).then(d => d.success && setCategories(d.data));
  }, []);

  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) return prev.map(i => i.productId === product.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { productId: product.id, name: product.name, qty: 1, price: product.salePrice }];
    });
  };

  const removeFromCart = (productId: string) => setCart(prev => prev.filter(i => i.productId !== productId));

  const filteredProducts = selectedCat ? products.filter(p => p.categoryId === selectedCat) : products;
  const total = cart.reduce((sum, i) => sum + i.qty * i.price, 0);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 flex">
        <div className="flex-1 p-4 overflow-auto">
          <div className="flex gap-2 mb-4">
            <button onClick={() => setSelectedCat('')} className={`px-4 py-2 rounded ${!selectedCat ? 'bg-blue-600 text-white' : 'bg-white'}`}>All</button>
            {categories.map(c => <button key={c.id} onClick={() => setSelectedCat(c.id)} className={`px-4 py-2 rounded ${selectedCat === c.id ? 'bg-blue-600 text-white' : 'bg-white'}`}>{c.name}</button>)}
          </div>
          <div className="grid grid-cols-4 gap-4">
            {filteredProducts.map(p => (
              <button key={p.id} onClick={() => addToCart(p)} className="bg-white rounded-lg shadow p-4 text-left hover:shadow-md transition">
                <p className="font-semibold">{p.name}</p>
                <p className="text-blue-600 font-bold mt-2">${p.salePrice.toFixed(2)}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="w-80 bg-white shadow-lg p-4 flex flex-col">
          <h2 className="text-lg font-bold mb-4">Cart</h2>
          <div className="flex-1 overflow-auto">
            {cart.map(item => (
              <div key={item.productId} className="flex justify-between items-center py-2 border-b">
                <div>
                  <p className="font-medium">{item.name}</p>
                  <p className="text-sm text-gray-500">{item.qty} x ${item.price.toFixed(2)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">${(item.qty * item.price).toFixed(2)}</p>
                  <button onClick={() => removeFromCart(item.productId)} className="text-red-500 text-xs">Remove</button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <button className="w-full bg-green-600 text-white rounded-md py-3 mt-4 hover:bg-green-700 transition font-semibold">Place Order</button>
          </div>
        </div>
      </div>
    </div>
  );
}
