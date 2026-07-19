'use client';
import Sidebar from '@/components/Sidebar';
import { BarChart3, TrendingUp, PieChart, Activity, Users, ArrowUpRight } from 'lucide-react';

export default function AnalyticsPage() {
  return (
    <div className="flex h-screen bg-[#F8F4EA] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="p-8 pb-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-[#A56A2B] p-3 rounded-2xl shadow-sm-lg shadow-sm-[#A56A2B]/30 text-white">
                <BarChart3 size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#2C1810]">Analytics</h1>
                <p className="text-[#6B5B4F] font-medium">Deep dive into your business performance</p>
              </div>
            </div>
            <div className="flex gap-3">
              <select className="bg-white border border-[#E7DDCF] text-[#2C1810] text-sm font-bold rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-[#A56A2B]">
                <option>Last 7 Days</option>
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex-1 px-8 pb-8 overflow-y-auto">
          {/* Top KPI row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {[
              { label: 'Revenue Growth', value: '+24.5%', icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-100' },
              { label: 'Customer Retention', value: '86.2%', icon: Users, color: 'text-blue-500', bg: 'bg-blue-100' },
              { label: 'Avg Conversion', value: '12.4%', icon: Activity, color: 'text-purple-500', bg: 'bg-purple-100' }
            ].map((kpi, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-[#E7DDCF] shadow-sm hover:shadow-sm-md transition-shadow-sm flex items-center justify-between group">
                <div>
                  <p className="text-[#6B5B4F] text-sm font-bold uppercase tracking-wide mb-1">{kpi.label}</p>
                  <h3 className="text-3xl font-black text-[#2C1810]">{kpi.value}</h3>
                </div>
                <div className={`p-4 rounded-2xl ${kpi.bg} ${kpi.color} group-hover:scale-110 transition-transform`}>
                  <kpi.icon size={28} />
                </div>
              </div>
            ))}
          </div>

          {/* Charts area placeholder */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-3xl p-6 border border-[#E7DDCF] shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#2C1810]">Sales Overview</h3>
                <button className="text-[#A56A2B] font-bold text-sm hover:underline">View Report</button>
              </div>
              <div className="h-64 flex items-end justify-between gap-2">
                {/* Mock Chart Bars */}
                {[40, 70, 45, 90, 65, 85, 100].map((h, i) => (
                  <div key={i} className="w-full bg-[#F8F4EA] rounded-t-lg relative group">
                    <div className="absolute bottom-0 w-full bg-gradient-to-t from-[#A56A2B] to-[#D97706] rounded-t-lg transition-all duration-500 group-hover:opacity-80" style={{ height: `${h}%` }}></div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-[#6B5B4F] text-sm font-bold">
                <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#E7DDCF] shadow-sm flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-[#2C1810]">Top Categories</h3>
                <PieChart className="text-[#6B5B4F]" />
              </div>
              <div className="flex-1 flex items-center justify-center relative">
                {/* Mock Donut Chart */}
                <div className="w-48 h-48 rounded-full border-[16px] border-[#A56A2B] relative">
                  <div className="absolute inset-[-16px] rounded-full border-[16px] border-transparent border-t-[#D97706] border-r-[#D97706] transform rotate-45"></div>
                  <div className="absolute inset-[-16px] rounded-full border-[16px] border-transparent border-b-[#FCD34D] transform -rotate-45"></div>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-black text-[#2C1810]">1.2k</span>
                    <span className="text-xs font-bold text-[#6B5B4F]">Orders</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-sm font-bold text-[#6B5B4F]"><div className="w-3 h-3 rounded-full bg-[#A56A2B]"></div> Food</div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#6B5B4F]"><div className="w-3 h-3 rounded-full bg-[#D97706]"></div> Drinks</div>
                <div className="flex items-center gap-2 text-sm font-bold text-[#6B5B4F]"><div className="w-3 h-3 rounded-full bg-[#FCD34D]"></div> Dessert</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
