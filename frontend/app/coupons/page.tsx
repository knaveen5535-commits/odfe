'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface Coupon { id: string; code: string; discountType: string; discountValue: number; validFrom: string; validUntil: string; isActive: boolean; }

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/coupons`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => d.success && setCoupons(d.data));
  }, []);

  return (
    <div className="flex h-screen bg-[#F8F4EA]">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-[#2C1810] mb-6">Coupons</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coupons.map(c => (
            <div key={c.id} className={`bg-white rounded-3xl shadow-sm border border-[#E7DDCF] p-4 border-l-4 ${c.isActive ? 'border-success' : 'border-[#E7DDCF]'}`}>
              <p className="font-bold text-lg text-[#2C1810]">{c.code}</p>
              <p className="text-2xl font-bold text-[#A56A2B]">{c.discountType === 'percentage' ? `${c.discountValue}%` : `$${c.discountValue}`} off</p>
              <p className="text-sm text-[#6B5B4F] mt-2">Valid: {new Date(c.validFrom).toLocaleDateString()} - {new Date(c.validUntil).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}