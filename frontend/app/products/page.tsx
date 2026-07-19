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
    <div className="flex h-screen bg-[#F8F4EA]">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-[#2C1810] mb-6">Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-3xl shadow-sm border border-[#E7DDCF] p-4">
              <p className="font-semibold text-[#2C1810]">{p.name}</p>
              <p className="text-[#A56A2B] font-bold">${p.salePrice.toFixed(2)}</p>
              <p className="text-sm text-[#6B5B4F]">{p.category.name}</p>
              <div className="flex gap-2 mt-2">
                <span className={`px-2 py-1 rounded-full text-xs ${p.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{p.isActive ? 'Active' : 'Inactive'}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${p.isAvailable ? 'bg-[#A56A2B]/10 text-[#A56A2B]' : 'bg-[#F8F4EA] text-[#6B5B4F]'}`}>{p.isAvailable ? 'Available' : 'Unavailable'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}