'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface Category { id: string; name: string; sequence: number; isActive: boolean; }

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => d.success && setCategories(d.data));
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-[#2B1D15] mb-6">Categories</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map(c => (
            <div key={c.id} className="bg-surface rounded-lg shadow border border-border p-4">
              <p className="font-semibold text-[#2B1D15]">{c.name}</p>
              <p className="text-sm text-secondary-text">Sequence: {c.sequence}</p>
              <span className={`inline-block mt-2 px-2 py-1 rounded-full text-xs ${c.isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>{c.isActive ? 'Active' : 'Inactive'}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}