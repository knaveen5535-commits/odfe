'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Navbar';

interface TableData { id: string; name: string; capacity: number; status: string; posX: number; posY: number; }

export default function TablesPage() {
  const [tables, setTables] = useState<TableData[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/tables`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => d.success && setTables(d.data));
  }, []);

  const statusColors: Record<string, string> = { AVAILABLE: 'bg-green-500', OCCUPIED: 'bg-red-500', RESERVED: 'bg-yellow-500', CLEANING: 'bg-blue-500', UNAVAILABLE: 'bg-gray-500' };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Tables</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {tables.map(t => (
            <div key={t.id} className={`rounded-lg shadow p-6 text-white ${statusColors[t.status] || 'bg-gray-500'}`}>
              <p className="text-lg font-bold">{t.name}</p>
              <p className="text-sm opacity-90">Capacity: {t.capacity}</p>
              <p className="text-xs opacity-75 mt-2">{t.status}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
