'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { Users, Search, Crown, ArrowRight, UserPlus, Phone, Mail } from 'lucide-react';

interface Customer { id: string; name: string; phone: string; email: string; isVip: boolean; totalOrders: number; totalSpent: number; }

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => {
        if (d.success) setCustomers(d.data);
      }).catch(() => {});
  }, []);

  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (c.phone || '').includes(searchTerm)
  );

  return (
    <div className="flex h-screen bg-[#F8F4EA] font-sans selection:bg-[#A56A2B] selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#D97706]/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="p-8 pb-6 flex-shrink-0 relative z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[#A56A2B] to-[#8B5A2B] p-3 rounded-2xl shadow-sm-lg shadow-sm-[#A56A2B]/30 text-white">
                <Users size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#2C1810]">Customers Directory</h1>
                <p className="text-[#6B5B4F] font-medium">Manage loyalty profiles and view purchase history</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search name or phone..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl shadow-sm border border-[#E7DDCF] focus:ring-2 focus:ring-[#A56A2B] outline-none text-[#2C1810] font-bold transition-all"
                />
              </div>
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#2C1810] text-white font-bold rounded-xl shadow-sm-lg hover:bg-[#1a0f0a] hover:-translate-y-0.5 transition-all">
                <UserPlus size={18} /> New Customer
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 px-8 pb-8 overflow-hidden relative z-10">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-sm-2xl shadow-sm-black/5 border border-white h-full flex flex-col overflow-hidden">
            <div className="overflow-y-auto flex-1 p-0 no-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F8F4EA]/50 sticky top-0 backdrop-blur-md z-10">
                  <tr>
                    {['Customer', 'Contact', 'Loyalty Status', 'Total Orders', 'Lifetime Value', ''].map((h, idx) => (
                      <th key={idx} className="px-8 py-5 text-xs font-black text-[#6B5B4F] uppercase tracking-widest border-b border-[#E7DDCF]/50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7DDCF]/50">
                  {filteredCustomers.map((c) => (
                    <tr key={c.id} className="hover:bg-[#F8F4EA]/40 transition-colors group cursor-pointer">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-gray-100 to-gray-200 border border-gray-300 text-gray-600 flex items-center justify-center text-lg font-black shadow-sm-inner group-hover:from-[#A56A2B] group-hover:to-[#8B5A2B] group-hover:text-white group-hover:border-[#A56A2B] transition-all">
                            {c.name.charAt(0)}
                          </div>
                          <div>
                            <span className="font-black text-[#2C1810] text-lg block">{c.name}</span>
                            <span className="text-xs font-bold text-gray-400">ID: {c.id.split('-')[0]}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5 text-sm font-bold text-[#6B5B4F]"><Phone size={14}/> {c.phone || '-'}</span>
                          <span className="flex items-center gap-1.5 text-xs font-medium text-gray-400"><Mail size={14}/> {c.email || 'No email provided'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {c.isVip ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-3xl text-xs font-bold bg-gradient-to-r from-amber-100 to-yellow-100 text-amber-700 border border-amber-200 shadow-sm">
                            <Crown size={14} className="text-amber-500 fill-amber-500"/> VIP Member
                          </span>
                        ) : (
                          <span className="inline-flex px-3 py-1.5 rounded-3xl text-xs font-bold bg-gray-50 text-gray-500 border border-gray-200">
                            Standard
                          </span>
                        )}
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-black text-[#2C1810] bg-gray-50 px-3 py-1 rounded-3xl border border-gray-100">{c.totalOrders}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-black text-[#A56A2B] text-xl">${c.totalSpent.toFixed(2)}</span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button className="opacity-0 group-hover:opacity-100 flex items-center justify-center w-10 h-10 ml-auto bg-white border border-[#E7DDCF] shadow-sm rounded-xl text-[#A56A2B] hover:bg-[#A56A2B] hover:text-white transition-all">
                          <ArrowRight size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {filteredCustomers.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center text-gray-400 font-bold">
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            
            <div className="bg-[#F8F4EA]/50 p-4 border-t border-[#E7DDCF]/50 text-center flex justify-between items-center px-8">
              <p className="text-sm font-bold text-[#6B5B4F]">Showing {filteredCustomers.length} customers</p>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 text-sm font-bold text-gray-400 bg-white border border-gray-200 rounded-3xl disabled:opacity-50" disabled>Previous</button>
                <button className="px-3 py-1.5 text-sm font-bold text-[#2C1810] bg-white border border-[#E7DDCF] shadow-sm rounded-3xl hover:bg-gray-50">Next</button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}