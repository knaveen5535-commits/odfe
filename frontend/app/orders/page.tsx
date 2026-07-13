'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { ClipboardList, Search, Filter, ChevronDown, CheckCircle2, Clock, XCircle, Coffee } from 'lucide-react';

interface Order { id: string; orderRef: string; total: number; status: string; table?: { name: string }; employee: { name: string }; orderDate: string; }

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then(r => r.json()).then(d => {
      if (d.success) setOrders(d.data.orders);
    }).catch(() => {});
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'DRAFT': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200"><Clock size={12}/> DRAFT</span>;
      case 'CONFIRMED': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200"><CheckCircle2 size={12}/> CONFIRMED</span>;
      case 'PREPARING': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200"><Coffee size={12}/> PREPARING</span>;
      case 'READY': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200"><CheckCircle2 size={12}/> READY</span>;
      case 'PAID': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-[#A56A2B]/10 text-[#A56A2B] border border-[#A56A2B]/20"><CheckCircle2 size={12}/> PAID</span>;
      case 'CANCELLED': return <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold bg-red-100 text-red-700 border border-red-200"><XCircle size={12}/> CANCELLED</span>;
      default: return <span className="inline-flex px-3 py-1 rounded-lg text-xs font-bold bg-gray-100 text-gray-600 border border-gray-200">{status}</span>;
    }
  };

  const filteredOrders = orders.filter(o => 
    o.orderRef.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (o.table?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#F8F4EA] font-sans selection:bg-[#A56A2B] selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative">
        
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A56A2B]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="p-8 pb-6 flex-shrink-0 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[#A56A2B] to-[#8B5A2B] p-3 rounded-2xl shadow-lg shadow-[#A56A2B]/30 text-white">
                <ClipboardList size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#2C1810]">Active Orders</h1>
                <p className="text-[#6B5B4F] font-medium">Track and manage customer tickets</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-72">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input 
                  type="text" 
                  placeholder="Search order ref or table..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl shadow-sm border border-[#E7DDCF] focus:ring-2 focus:ring-[#A56A2B] outline-none text-[#2C1810] font-bold transition-all"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#2C1810] font-bold rounded-xl border border-[#E7DDCF] shadow-sm hover:bg-gray-50 transition-colors shrink-0">
                <Filter size={18} /> Filter <ChevronDown size={14}/>
              </button>
            </div>
          </div>
        </div>

        <div className="flex-1 px-8 pb-8 overflow-hidden relative z-10">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-2xl shadow-black/5 border border-white h-full flex flex-col overflow-hidden">
            <div className="overflow-x-auto flex-1 p-0">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F8F4EA]/50 sticky top-0 backdrop-blur-md z-10">
                  <tr>
                    {['Order Ref', 'Table', 'Waiter', 'Status', 'Date & Time', 'Total Amount'].map((h, idx) => (
                      <th key={idx} className="px-8 py-5 text-xs font-black text-[#6B5B4F] uppercase tracking-widest border-b border-[#E7DDCF]/50">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E7DDCF]/50">
                  {filteredOrders.map(order => (
                    <tr key={order.id} className="hover:bg-[#F8F4EA]/40 transition-colors group cursor-pointer">
                      <td className="px-8 py-5">
                        <span className="font-black text-[#2C1810] bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100">{order.orderRef}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-bold text-[#6B5B4F]">{order.table?.name || 'Takeaway'}</span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-[#A56A2B]/10 text-[#A56A2B] flex items-center justify-center text-xs font-bold border border-[#A56A2B]/20">
                            {order.employee.name.charAt(0)}
                          </div>
                          <span className="font-bold text-[#2C1810]">{order.employee.name}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {getStatusBadge(order.status)}
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-sm font-bold text-[#6B5B4F]">{new Date(order.orderDate).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-black text-[#A56A2B] text-lg">${order.total.toFixed(2)}</span>
                      </td>
                    </tr>
                  ))}
                  {filteredOrders.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-8 py-12 text-center text-gray-400 font-bold">
                        No orders found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}