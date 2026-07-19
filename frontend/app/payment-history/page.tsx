'use client';
import Sidebar from '@/components/Sidebar';
import { History, Calendar, Download, TrendingUp, CreditCard, Banknote, Smartphone, ChevronRight, Activity, ArrowUpRight } from 'lucide-react';

export default function PaymentHistoryPage() {
  return (
    <div className="flex h-screen bg-[#F8F4EA] font-sans selection:bg-[#A56A2B] selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        {/* Background Decorative Blur */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A56A2B]/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="p-8 pb-4 flex-shrink-0 relative z-10">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[#A56A2B] to-[#8B5A2B] p-4 rounded-2xl shadow-sm-xl shadow-sm-[#A56A2B]/30 text-white">
                <History size={32} />
              </div>
              <div>
                <h1 className="text-4xl font-black text-[#2C1810] tracking-tight">Billing Ledger</h1>
                <p className="text-[#6B5B4F] font-medium text-lg mt-1">Track settlements, batches, and transactions</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="flex items-center gap-2 px-5 py-3 bg-white/60 backdrop-blur-md text-[#2C1810] font-bold rounded-2xl border border-white shadow-sm hover:shadow-sm-md transition-all">
                <Calendar size={20} className="text-[#A56A2B]"/> Last 30 Days
              </button>
              <button className="flex items-center gap-2 px-5 py-3 bg-[#2C1810] text-white font-bold rounded-2xl shadow-sm-xl shadow-sm-black/10 hover:bg-[#1a0f0a] hover:-translate-y-0.5 transition-all">
                <Download size={20} /> Export Report
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 px-8 pb-8 overflow-y-auto relative z-10 no-scrollbar">
          
          {/* Top High-level Stats with Glassmorphism */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-8">
            
            {/* Primary Stat Card */}
            <div className="lg:col-span-5 bg-gradient-to-br from-[#2C1810] to-[#4A2E20] rounded-[2rem] p-8 text-white relative overflow-hidden shadow-sm-2xl">
              <div className="absolute top-0 right-0 w-48 h-48 bg-[#A56A2B] rounded-full blur-[60px] opacity-40 -mr-10 -mt-10"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <p className="text-white/70 font-bold uppercase tracking-widest text-sm mb-2 flex items-center gap-2">
                    <Activity size={16}/> Total Settled Volume
                  </p>
                  <h2 className="text-5xl font-black text-white">$42,850.00</h2>
                  <div className="mt-4 flex items-center gap-2 text-emerald-400 bg-emerald-400/10 w-max px-3 py-1.5 rounded-full text-sm font-bold border border-emerald-400/20">
                    <ArrowUpRight size={16}/> +15.2% vs last month
                  </div>
                </div>
                <div className="mt-8 flex justify-between items-end">
                  <div className="flex -space-x-2">
                    {[1,2,3,4].map(i => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-[#2C1810] bg-[#F8F4EA] flex items-center justify-center text-xs font-bold text-[#A56A2B]">T{i}</div>
                    ))}
                    <div className="w-10 h-10 rounded-full border-2 border-[#2C1810] bg-white/20 backdrop-blur-md flex items-center justify-center text-xs font-bold text-white">+12</div>
                  </div>
                  <p className="text-white/50 text-sm font-medium">16 active terminals</p>
                </div>
              </div>
            </div>

            {/* Sub Stats */}
            <div className="lg:col-span-7 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Card Payments', value: '$28,450', percent: '66%', icon: CreditCard, color: 'text-blue-600', bg: 'bg-blue-100', border: 'border-blue-200' },
                { label: 'Cash Drawer', value: '$9,200', percent: '22%', icon: Banknote, color: 'text-emerald-600', bg: 'bg-emerald-100', border: 'border-emerald-200' },
                { label: 'Digital/QR', value: '$5,200', percent: '12%', icon: Smartphone, color: 'text-purple-600', bg: 'bg-purple-100', border: 'border-purple-200' },
              ].map((stat, i) => (
                <div key={i} className="bg-white/80 backdrop-blur-lg p-6 rounded-[2rem] border border-white shadow-sm-xl shadow-sm-[#2C1810]/5 flex flex-col justify-between group hover:-translate-y-1 transition-transform">
                  <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} ${stat.border} border group-hover:scale-110 transition-transform`}>
                      <stat.icon size={24} />
                    </div>
                    <span className="text-sm font-bold text-[#6B5B4F] bg-[#F8F4EA] px-2.5 py-1 rounded-3xl">{stat.percent}</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-[#2C1810] mb-1">{stat.value}</h3>
                    <p className="text-[#6B5B4F] text-sm font-bold uppercase tracking-wider">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Transactions Ledger */}
          <div className="bg-white rounded-[2.5rem] shadow-sm-2xl shadow-sm-black/5 border border-white overflow-hidden relative">
            <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-[#A56A2B] via-[#D97706] to-[#A56A2B]"></div>
            
            <div className="p-8 border-b border-[#E7DDCF]/50 flex justify-between items-center bg-gray-50/30">
              <div>
                <h2 className="text-2xl font-black text-[#2C1810]">Settlement Batches</h2>
                <p className="text-[#6B5B4F] font-medium mt-1">End of day and shift-wise batch reports</p>
              </div>
              <button className="text-[#A56A2B] font-bold hover:bg-[#F8F4EA] px-4 py-2 rounded-xl transition-colors flex items-center gap-1">
                View All <ChevronRight size={18}/>
              </button>
            </div>
            
            <div className="p-0">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F8F4EA]/50">
                  <tr>
                    {['Batch ID', 'Date & Time', 'Terminals', 'Status', 'Net Amount', ''].map((h, idx) => (
                      <th key={idx} className="px-8 py-5 text-xs font-black text-[#6B5B4F] uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7DDCF]/50">
                  {[
                    { batch: 'BCH-8924', date: 'Today, 22:30', term: '4 active', amount: '$4,120.50', status: 'Settled', statusColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                    { batch: 'BCH-8923', date: 'Today, 14:00', term: '3 active', amount: '$1,850.25', status: 'Settled', statusColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                    { batch: 'BCH-8922', date: 'Yesterday, 22:45', term: '5 active', amount: '$5,290.00', status: 'Settled', statusColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                    { batch: 'BCH-8921', date: 'Oct 22, 23:00', term: '4 active', amount: '$3,940.00', status: 'Pending', statusColor: 'bg-amber-100 text-amber-700 border-amber-200' },
                    { batch: 'BCH-8920', date: 'Oct 21, 22:15', term: '4 active', amount: '$4,005.50', status: 'Settled', statusColor: 'bg-emerald-100 text-emerald-700 border-emerald-200' },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-[#F8F4EA]/40 transition-colors group cursor-pointer">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-[#F8F4EA] flex items-center justify-center text-[#A56A2B] group-hover:bg-[#A56A2B] group-hover:text-white transition-colors">
                            <History size={18} />
                          </div>
                          <span className="font-bold text-[#2C1810]">{row.batch}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6 text-sm font-bold text-[#6B5B4F]">{row.date}</td>
                      <td className="px-8 py-6 text-sm font-medium text-[#6B5B4F]">{row.term}</td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-3xl text-xs font-bold uppercase tracking-wider border ${row.statusColor}`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-8 py-6 font-black text-[#2C1810] text-lg">{row.amount}</td>
                      <td className="px-8 py-6 text-right">
                        <button className="opacity-0 group-hover:opacity-100 text-[#A56A2B] font-bold text-sm bg-white border border-[#E7DDCF] shadow-sm px-4 py-2 rounded-3xl transition-all hover:bg-[#F8F4EA]">
                          Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="bg-[#F8F4EA]/50 p-4 border-t border-[#E7DDCF]/50 text-center">
              <p className="text-sm font-bold text-[#6B5B4F]">Showing last 5 batch settlements. All amounts include calculated tax.</p>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
