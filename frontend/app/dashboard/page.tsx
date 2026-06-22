'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Navbar';

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
    { label: 'Today Orders', value: data?.todayOrders ?? 0, color: 'bg-blue-500' },
    { label: 'Revenue', value: `$${data?.totalRevenue?.toFixed(2) ?? '0.00'}`, color: 'bg-green-500' },
    { label: 'Avg Order', value: `$${data?.averageOrder?.toFixed(2) ?? '0.00'}`, color: 'bg-purple-500' },
    { label: 'Pending', value: data?.pendingOrders ?? 0, color: 'bg-yellow-500' },
    { label: 'Employees', value: data?.totalEmployees ?? 0, color: 'bg-indigo-500' },
    { label: 'Active Tables', value: data?.activeTables ?? 0, color: 'bg-pink-500' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.label} className="bg-white rounded-lg shadow p-6">
              <div className={`w-12 h-12 ${card.color} rounded-lg flex items-center justify-center mb-4`}>
                <span className="text-white text-xl font-bold">{card.label[0]}</span>
              </div>
              <p className="text-gray-500 text-sm">{card.label}</p>
              <p className="text-2xl font-bold mt-1">{card.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
