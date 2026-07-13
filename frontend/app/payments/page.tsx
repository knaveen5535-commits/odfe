'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { DollarSign, Search, Filter, Download, ArrowUpRight, ArrowDownRight, CreditCard } from 'lucide-react';

interface Payment { id: string; paymentRef: string; amount: number; status: string; method: { name: string }; order: { orderRef: string }; paymentDate: string; }

export default function PaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => {
        if (d.success) setPayments(d.data);
        setLoading(false);
      }).catch(() => setLoading(false));
  }, []);

  const filteredPayments = payments.filter(p => 
    p.paymentRef.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.order.orderRef.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F8F4EA] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header Section */}
        <div className="p-8 pb-4 flex-shrink-0">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-[#A56A2B] p-3 rounded-2xl shadow-lg shadow-[#A56A2B]/30 text-white">
                <CreditCard size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#2C1810]">Payments</h1>
                <p className="text-[#6B5B4F] font-medium">Manage transactions and billing</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#2C1810] font-bold rounded-xl border border-[#E7DDCF] shadow-sm hover:bg-gray-50 transition-colors">
                <Filter size={18} /> Filter
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#2C1810] text-white font-bold rounded-xl shadow-lg hover:bg-[#1a0f0a] transition-colors">
                <Download size={18} /> Export
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#6B5B4F]" />
            </div>
            <input
              type="text"
              placeholder="Search by Payment Ref or Order Ref..."
              className="block w-full pl-11 pr-4 py-3.5 bg-white border border-[#E7DDCF] rounded-2xl text-[#2C1810] font-medium placeholder-[#6B5B4F] focus:ring-2 focus:ring-[#A56A2B] focus:border-transparent shadow-sm transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Table Section */}
        <div className="flex-1 px-8 pb-8 overflow-hidden">
          <div className="bg-white rounded-3xl shadow-xl shadow-black/5 border border-white h-full flex flex-col overflow-hidden">
            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50/80 backdrop-blur-sm sticky top-0 z-10 border-b border-[#E7DDCF]">
                  <tr>
                    {['Transaction Ref', 'Order Ref', 'Method', 'Amount', 'Status', 'Date'].map(h => (
                      <th key={h} className="px-6 py-4 text-xs font-black text-[#6B5B4F] uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7DDCF]/50">
                  {loading ? (
                    [1,2,3,4,5].map(i => (
                      <tr key={i} className="animate-pulse">
                        <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                        <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                        <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                        <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                        <td className="px-6 py-5"><div className="h-6 bg-gray-200 rounded-full w-24"></div></td>
                        <td className="px-6 py-5"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                      </tr>
                    ))
                  ) : filteredPayments.length > 0 ? (
                    filteredPayments.map((p, idx) => (
                      <tr key={p.id} className="hover:bg-[#F8F4EA]/50 transition-colors group cursor-default">
                        <td className="px-6 py-5 font-bold text-[#2C1810]">{p.paymentRef}</td>
                        <td className="px-6 py-5 font-medium text-[#6B5B4F] group-hover:text-[#A56A2B] transition-colors">{p.order.orderRef}</td>
                        <td className="px-6 py-5">
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 text-gray-700 font-semibold text-sm">
                            {p.method.name}
                          </div>
                        </td>
                        <td className="px-6 py-5 font-black text-[#2C1810]">${p.amount.toFixed(2)}</td>
                        <td className="px-6 py-5">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                            p.status === 'COMPLETED' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 
                            p.status === 'FAILED' ? 'bg-red-100 text-red-800 border border-red-200' :
                            'bg-amber-100 text-amber-800 border border-amber-200'
                          }`}>
                            {p.status}
                          </span>
                        </td>
                        <td className="px-6 py-5 text-sm font-medium text-[#6B5B4F]">
                          {new Date(p.paymentDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="px-6 py-20 text-center text-[#6B5B4F]">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                          <Search size={24} className="text-gray-400" />
                        </div>
                        <h3 className="text-lg font-bold text-[#2C1810] mb-1">No payments found</h3>
                        <p>We couldn't find any transactions matching your search.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination / Footer */}
            <div className="bg-gray-50/80 backdrop-blur-sm border-t border-[#E7DDCF] px-6 py-4 flex items-center justify-between">
              <span className="text-sm font-medium text-[#6B5B4F]">Showing <span className="font-bold text-[#2C1810]">{filteredPayments.length}</span> results</span>
              <div className="flex gap-2">
                <button className="px-4 py-2 border border-[#E7DDCF] rounded-lg text-sm font-bold text-[#2C1810] hover:bg-white transition-colors disabled:opacity-50" disabled>Previous</button>
                <button className="px-4 py-2 border border-[#E7DDCF] rounded-lg text-sm font-bold text-[#2C1810] hover:bg-white transition-colors disabled:opacity-50" disabled>Next</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}