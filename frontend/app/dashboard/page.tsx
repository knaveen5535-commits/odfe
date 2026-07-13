'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { TrendingUp, DollarSign, ShoppingBag, Users, Utensils, Activity, ArrowUpRight, ArrowDownRight } from 'lucide-react';

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/dashboard/summary`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) setData(d.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Total Revenue', value: `$${data?.totalRevenue?.toFixed(2) ?? '0.00'}`, icon: DollarSign, trend: '+12.5%', isUp: true, color: 'from-emerald-500 to-emerald-700' },
    { label: 'Today Orders', value: data?.todayOrders ?? 0, icon: ShoppingBag, trend: '+5.2%', isUp: true, color: 'from-amber-500 to-amber-700' },
    { label: 'Avg Order Value', value: `$${data?.averageOrder?.toFixed(2) ?? '0.00'}`, icon: TrendingUp, trend: '-2.1%', isUp: false, color: 'from-blue-500 to-blue-700' },
    { label: 'Pending Orders', value: data?.pendingOrders ?? 0, icon: Activity, trend: '4 urgent', isUp: false, color: 'from-red-500 to-red-700' },
    { label: 'Total Employees', value: data?.totalEmployees ?? 0, icon: Users, trend: '+1 new', isUp: true, color: 'from-purple-500 to-purple-700' },
    { label: 'Active Tables', value: data?.activeTables ?? 0, icon: Utensils, trend: 'Near cap', isUp: true, color: 'from-orange-500 to-orange-700' },
  ];

  return (
    <div className="flex h-screen bg-[#F8F4EA] font-sans">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-4xl font-extrabold text-[#2C1810] tracking-tight">Overview</h1>
            <p className="text-[#6B5B4F] mt-2 text-lg">Welcome back! Here's what's happening today.</p>
          </div>
          <div className="bg-white/60 backdrop-blur-md px-6 py-3 rounded-full border border-white/50 shadow-sm">
            <span className="text-[#A56A2B] font-semibold">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="animate-pulse bg-white rounded-3xl h-44 shadow-sm border border-white"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {cards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="group relative bg-white/70 backdrop-blur-xl rounded-3xl p-8 border border-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ease-out overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-10 rounded-bl-full -mr-8 -mt-8 transition-transform duration-500 group-hover:scale-150"></div>
                  
                  <div className="flex justify-between items-start mb-6 relative z-10">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-lg shadow-black/10 text-white transform group-hover:rotate-6 transition-transform`}>
                      <Icon size={28} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-bold px-3 py-1.5 rounded-full ${card.isUp ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                      {card.isUp ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                      {card.trend}
                    </div>
                  </div>
                  
                  <div className="relative z-10">
                    <p className="text-[#6B5B4F] text-sm font-semibold uppercase tracking-wider mb-2">{card.label}</p>
                    <h3 className="text-4xl font-extrabold text-[#2C1810]">{card.value}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
