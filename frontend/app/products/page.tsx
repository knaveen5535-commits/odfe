'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface Product { id: string; name: string; salePrice: number; category: { name: string }; isActive: boolean; isAvailable: boolean; }

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => d.success && setProducts(d.data));
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-[#2B1D15] mb-6">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-surface rounded-lg shadow border border-border p-4">
              <p className="font-semibold text-[#2B1D15]">{p.name}</p>
              <p className="text-primary font-bold">${p.salePrice.toFixed(2)}</p>
              <p className="text-sm text-secondary-text">{p.category.name}</p>
              <div className="flex gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${p.isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${p.isAvailable ? 'bg-primary/10 text-primary' : 'bg-background text-secondary-text'}`}>{p.isAvailable ? 'Available' : 'Unavailable'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}