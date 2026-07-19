'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { useRouter } from 'next/navigation';
import { LayoutGrid, Users, DollarSign, Plus, Settings2, MoreHorizontal } from 'lucide-react';

interface TableData { 
  id: string; 
  name: string; 
  capacity: number; 
  status: string; 
  posX: number; 
  posY: number; 
  orders?: { total: number; employee?: { name: string } }[];
}

export default function TablesPage() {
  const [tables, setTables] = useState<TableData[]>([]);
  const [contextMenu, setContextMenu] = useState<{ x: number, y: number, tableId: string } | null>(null);
  const router = useRouter();

  const fetchTables = () => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tables`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => {
        if (d.success) setTables(d.data);
      }).catch(() => {});
  };

  useEffect(() => {
    fetchTables();
    const id = setInterval(fetchTables, 10000);
    return () => clearInterval(id);
  }, []);

  const getStatusStyles = (status: string) => {
    switch (status) {
      case 'AVAILABLE': return { bg: 'bg-emerald-50 border-emerald-200', text: 'text-emerald-700', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200' };
      case 'OCCUPIED': return { bg: 'bg-[#F8F4EA] border-[#A56A2B]/40', text: 'text-[#2C1810]', badge: 'bg-[#A56A2B] text-white border-[#A56A2B]' };
      case 'RESERVED': return { bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', badge: 'bg-amber-100 text-amber-800 border-amber-200' };
      case 'CLEANING': return { bg: 'bg-blue-50 border-blue-200', text: 'text-blue-700', badge: 'bg-blue-100 text-blue-700 border-blue-200' };
      default: return { bg: 'bg-gray-50 border-gray-200', text: 'text-gray-500', badge: 'bg-gray-100 text-gray-600 border-gray-200' };
    }
  };

  const handleContextMenu = (e: React.MouseEvent, tableId: string) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, tableId });
  };

  const updateTableStatus = async (id: string, status: string) => {
    const token = localStorage.getItem('accessToken');
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tables/${id}/status`, {
      method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    setContextMenu(null);
    fetchTables();
  };

  return (
    <div className="flex h-screen bg-[#F8F4EA] font-sans selection:bg-[#A56A2B] selection:text-white" onClick={() => setContextMenu(null)}>
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        
        {/* Header */}
        <div className="p-8 pb-4 flex-shrink-0 z-10">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-[#A56A2B] to-[#8B5A2B] p-3 rounded-2xl shadow-sm-lg shadow-sm-[#A56A2B]/30 text-white">
                <LayoutGrid size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#2C1810]">Floor Plan</h1>
                <p className="text-[#6B5B4F] font-medium">Manage tables, capacities, and active orders</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-[#2C1810] font-bold rounded-xl border border-[#E7DDCF] shadow-sm hover:bg-gray-50 transition-colors">
                <Settings2 size={18} /> Layout
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-[#2C1810] text-white font-bold rounded-xl shadow-sm-lg hover:bg-[#1a0f0a] transition-colors">
                <Plus size={18} /> Add Table
              </button>
            </div>
          </div>

          <div className="flex gap-4 items-center bg-white/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white shadow-sm inline-flex">
            <span className="text-sm font-bold text-[#6B5B4F] mr-2">Legend:</span>
            <div className="flex items-center gap-2 text-xs font-bold"><div className="w-3 h-3 rounded-full bg-emerald-400"></div> Available</div>
            <div className="flex items-center gap-2 text-xs font-bold"><div className="w-3 h-3 rounded-full bg-[#A56A2B]"></div> Occupied</div>
            <div className="flex items-center gap-2 text-xs font-bold"><div className="w-3 h-3 rounded-full bg-amber-400"></div> Reserved</div>
            <div className="flex items-center gap-2 text-xs font-bold"><div className="w-3 h-3 rounded-full bg-blue-400"></div> Cleaning</div>
          </div>
        </div>

        {/* Floor Grid */}
        <div className="flex-1 px-8 pb-8 overflow-y-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6 pb-20">
            {tables.length === 0 ? (
              [1,2,3,4,5,6,7,8,9,10].map(i => <div key={i} className="animate-pulse bg-white/50 rounded-[2rem] h-48 border border-[#E7DDCF]"></div>)
            ) : (
              tables.map(t => {
                const currentOrder = t.orders && t.orders.length > 0 ? t.orders[0] : null;
                const styles = getStatusStyles(t.status);
                
                return (
                  <div 
                    key={t.id} 
                    className={`relative rounded-[2rem] p-6 cursor-pointer border shadow-sm hover:shadow-sm-xl hover:-translate-y-1 transition-all duration-300 group ${styles.bg}`}
                    onContextMenu={(e) => handleContextMenu(e, t.id)}
                    onClick={() => router.push(`/pos?tableId=${t.id}`)}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className={`text-2xl font-black ${styles.text}`}>{t.name}</h3>
                      <button className={`p-1.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity bg-white/50 hover:bg-white text-gray-600`} onClick={(e) => { e.stopPropagation(); handleContextMenu(e, t.id); }}>
                        <MoreHorizontal size={18} />
                      </button>
                    </div>

                    <div className="space-y-3 mb-6">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                        <Users size={16} /> Capacity: {t.capacity}
                      </div>
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-500">
                        <DollarSign size={16} /> {currentOrder?.total ? currentOrder.total.toFixed(2) : '0.00'}
                      </div>
                    </div>

                    <div className="mt-auto">
                      <span className={`inline-flex px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-3xl border ${styles.badge}`}>
                        {t.status}
                      </span>
                    </div>

                    {currentOrder?.employee && (
                      <div className="absolute bottom-6 right-6 w-8 h-8 rounded-full bg-white shadow-sm border border-gray-200 flex items-center justify-center text-xs font-bold text-gray-600" title={`Waiter: ${currentOrder.employee.name}`}>
                        {currentOrder.employee.name.charAt(0)}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Custom Context Menu */}
        {contextMenu && (
          <div className="fixed inset-0 z-40" onClick={() => setContextMenu(null)}>
            <div 
              className="absolute bg-white/90 backdrop-blur-xl rounded-2xl shadow-sm-2xl py-2 w-48 z-50 border border-white overflow-hidden transform scale-100 opacity-100 transition-all origin-top-left"
              style={{ top: contextMenu.y, left: contextMenu.x }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-3 pb-2 pt-1 text-xs font-black text-gray-400 uppercase tracking-widest border-b border-gray-100 mb-2">Actions</div>
              <button className="w-full text-left px-4 py-2 hover:bg-[#F8F4EA] font-bold text-sm text-[#2C1810] transition-colors" onClick={() => updateTableStatus(contextMenu.tableId, 'RESERVED')}>Mark Reserved</button>
              <button className="w-full text-left px-4 py-2 hover:bg-[#F8F4EA] font-bold text-sm text-emerald-600 transition-colors" onClick={() => updateTableStatus(contextMenu.tableId, 'AVAILABLE')}>Mark Available</button>
              <button className="w-full text-left px-4 py-2 hover:bg-[#F8F4EA] font-bold text-sm text-blue-600 transition-colors" onClick={() => updateTableStatus(contextMenu.tableId, 'CLEANING')}>Mark Cleaning</button>
              <div className="h-px bg-gray-100 my-2"></div>
              <button className="w-full text-left px-4 py-2 hover:bg-[#F8F4EA] font-bold text-sm text-gray-600 transition-colors" onClick={() => { setContextMenu(null); }}>Change Waiter</button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}