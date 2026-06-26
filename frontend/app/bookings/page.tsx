'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface Booking { id: string; bookingRef: string; customer: { name: string }; table: { name: string }; bookingDate: string; guests: number; status: string; }

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => d.success && setBookings(d.data));
  }, []);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-[#2B1D15] mb-6">Bookings</h1>
        <div className="bg-surface rounded-lg shadow border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-background"><tr>{['Ref', 'Customer', 'Table', 'Date', 'Guests', 'Status'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-secondary-text uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-background">
                  <td className="px-6 py-4 font-medium text-[#2B1D15]">{b.bookingRef}</td>
                  <td className="px-6 py-4 text-secondary-text">{b.customer.name}</td>
                  <td className="px-6 py-4 text-secondary-text">{b.table.name}</td>
                  <td className="px-6 py-4 text-secondary-text">{new Date(b.bookingDate).toLocaleString()}</td>
                  <td className="px-6 py-4 text-secondary-text">{b.guests}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-xs bg-primary/10 text-primary">{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}