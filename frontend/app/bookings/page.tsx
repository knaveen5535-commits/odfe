'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Navbar';

interface Booking { id: string; bookingRef: string; customer: { name: string }; table: { name: string }; bookingDate: string; guests: number; status: string; }

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => d.success && setBookings(d.data));
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Bookings</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>{['Ref', 'Customer', 'Table', 'Date', 'Guests', 'Status'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-200">
              {bookings.map(b => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{b.bookingRef}</td>
                  <td className="px-6 py-4">{b.customer.name}</td>
                  <td className="px-6 py-4">{b.table.name}</td>
                  <td className="px-6 py-4">{new Date(b.bookingDate).toLocaleString()}</td>
                  <td className="px-6 py-4">{b.guests}</td>
                  <td className="px-6 py-4"><span className="px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800">{b.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
