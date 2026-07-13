'use client';
import Sidebar from '@/components/Sidebar';
import { History, Calendar, Download, TrendingUp, CreditCard, Banknote, Smartphone } from 'lucide-react';

export default function PaymentHistoryPage() {
  return (
    <div className="flex h-screen bg-[#F8F4EA] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="p-8 pb-4 flex-shrink-0">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-[#A56A2B] p-3 rounded-2xl shadow-lg shadow-[#A56A2B]/30 text-white">
                <History size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#2C1810]">Payment History</h1>
                <p className="text-[#6B5B4F] font-medium">Review past settlements and batch totals</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#2C1810] font-bold rounded-xl border border-[#E7DDCF] shadow-sm hover:bg-gray-50 transition-colors">
                <Calendar size={18} /> Select Date
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#2C1810] text-white font-bold rounded-xl shadow-lg hover:bg-[#1a0f0a] transition-colors">
                <Download size={18} /> Export CSV
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Total Settled', value: '$12,450.00', icon: TrendingUp, color: 'text-emerald-500' },
              { label: 'Credit/Debit', value: '$8,230.50', icon: CreditCard, color: 'text-blue-500' },
              { label: 'Cash', value: '$3,100.00', icon: Banknote, color: 'text-amber-500' },
              { label: 'Digital/UPI', value: '$1,119.50', icon: Smartphone, color: 'text-purple-500' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-[#E7DDCF] shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-[#6B5B4F] text-sm font-bold uppercase tracking-wide mb-1">{stat.label}</p>
                  <h3 className="text-2xl font-black text-[#2C1810]">{stat.value}</h3>
                </div>
                <div className={`p-3 rounded-xl bg-gray-50 border border-gray-100 ${stat.color}`}>
                  <stat.icon size={24} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 px-8 pb-8 overflow-hidden">
          <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-white h-full flex flex-col overflow-hidden">
            <div className="p-6 border-b border-[#E7DDCF] bg-gray-50/50 flex justify-between items-center">
              <h2 className="text-lg font-black text-[#2C1810]">Recent Batches</h2>
              <span className="text-sm font-bold text-[#A56A2B] bg-[#A56A2B]/10 px-3 py-1 rounded-full">Showing Last 7 Days</span>
            </div>
            <div className="overflow-x-auto flex-1 p-6">
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#E7DDCF] before:to-transparent">
                {[
                  { date: 'Today, 10:00 PM', batch: 'BATCH-892', amount: '$2,450.00', status: 'Settled', type: 'End of Day' },
                  { date: 'Yesterday, 10:30 PM', batch: 'BATCH-891', amount: '$3,120.50', status: 'Settled', type: 'End of Day' },
                  { date: 'Oct 22, 11:00 PM', batch: 'BATCH-890', amount: '$2,980.25', status: 'Settled', type: 'End of Day' },
                  { date: 'Oct 21, 10:15 PM', batch: 'BATCH-889', amount: '$3,900.00', status: 'Settled', type: 'Weekend Surge' }
                ].map((item, i) => (
                  <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-[#A56A2B] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 text-white">
                      <CheckCircleIcon />
                    </div>
                    
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-2xl border border-[#E7DDCF] bg-white shadow-sm hover:shadow-md hover:border-[#A56A2B]/50 transition-all">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-[#A56A2B] uppercase tracking-wider">{item.date}</span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">{item.status}</span>
                      </div>
                      <h3 className="font-black text-[#2C1810] text-xl mb-1">{item.amount}</h3>
                      <p className="text-[#6B5B4F] text-sm font-medium">Batch ID: {item.batch} • {item.type}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CheckCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
  );
}
