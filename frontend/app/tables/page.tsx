'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

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
      .then(r => r.json()).then(d => d.success && setTables(d.data));
  };

  useEffect(() => {
    fetchTables();
    const id = setInterval(fetchTables, 10000);
    return () => clearInterval(id);
  }, []);

  const statusColors: Record<string, string> = { AVAILABLE: 'bg-green-500', OCCUPIED: 'bg-red-500', RESERVED: 'bg-yellow-500', CLEANING: 'bg-blue-500', UNAVAILABLE: 'bg-gray-500' };

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
    <div className="flex h-screen bg-gray-100" onClick={() => setContextMenu(null)}>
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Floor Plan</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {tables.map(t => {
            const currentOrder = t.orders && t.orders.length > 0 ? t.orders[0] : null;
            return (
              <div 
                key={t.id} 
                className={`rounded-xl shadow-lg p-6 text-white cursor-pointer transform transition hover:scale-105 ${statusColors[t.status] || 'bg-gray-500'}`}
                onContextMenu={(e) => handleContextMenu(e, t.id)}
                onClick={() => router.push(`/pos?tableId=${t.id}`)}
              >
                <div className="flex justify-between items-center mb-2">
                  <p className="text-xl font-bold">{t.name}</p>
                  <p className="text-xs bg-black/20 px-2 py-1 rounded">{t.status}</p>
                </div>
                <div className="space-y-1 text-sm opacity-90">
                  <p>Capacity: {t.capacity}</p>
                  <p>Waiter: {currentOrder?.employee?.name || 'None'}</p>
                  <p>Order: ${currentOrder?.total?.toFixed(2) || '0.00'}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {contextMenu && (
        <div 
          className="fixed bg-white rounded-lg shadow-xl py-2 w-48 z-50 border border-gray-200"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-800" onClick={() => updateTableStatus(contextMenu.tableId, 'RESERVED')}>Reserve</button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-800" onClick={() => updateTableStatus(contextMenu.tableId, 'AVAILABLE')}>Release</button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-800" onClick={() => updateTableStatus(contextMenu.tableId, 'CLEANING')}>Cleaning</button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-800" onClick={() => { setContextMenu(null); alert('Change Waiter not implemented yet'); }}>Change Waiter</button>
          <button className="w-full text-left px-4 py-2 hover:bg-gray-100 text-sm text-gray-800" onClick={() => { setContextMenu(null); alert('Merge Tables not implemented yet'); }}>Merge Tables</button>
        </div>
      )}
    </div>
  );
}
