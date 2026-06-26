'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface DashboardData {
  todayOrders: number;
  totalRevenue: number;
  averageOrder: number;
  pendingOrders: number;
  totalEmployees: number;
  activeTables: number;
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    }).then(r => r.json()).then(d => d.success && setData(d.data));
  }, []);

  const cards = [
    { label: 'Today Orders', value: data?.todayOrders ?? 0, color: 'bg-primary' },
    { label: 'Revenue', value: `$${data?.totalRevenue?.toFixed(2) ?? '0.00'}`, color: 'bg-success' },
    { label: 'Avg Order', value: `$${data?.averageOrder?.toFixed(2) ?? '0.00'}`, color: 'bg-primary' },
    { label: 'Pending', value: data?.pendingOrders ?? 0, color: 'bg-warning' },
    { label: 'Employees', value: data?.totalEmployees ?? 0, color: 'bg-primary' },
    { label: 'Active Tables', value: data?.activeTables ?? 0, color: 'bg-primary' },
  ];

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-[#2B1D15] mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.label} className="bg-surface rounded-lg shadow p-6 border border-border">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                <span className="text-white text-xl font-bold">{card.label[0]}</span>
              </div>
              <p className="text-secondary-text text-sm">{card.label}</p>
              <p className="text-2xl font-bold text-[#2B1D15] mt-1">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
