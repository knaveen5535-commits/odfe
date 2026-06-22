'use client';
import { useState } from 'react';
import Sidebar from '@/components/Navbar';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('sales');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const generateReport = async () => {
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/reports/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ name: `${reportType} Report`, report_type: reportType, date_from: dateFrom, date_to: dateTo }),
    });
    const data = await res.json();
    alert(JSON.stringify(data.data || data));
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Reports</h1>
        <div className="bg-white rounded-lg shadow p-6 max-w-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Report Type</label>
              <select value={reportType} onChange={e => setReportType(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2">
                <option value="sales">Sales Report</option>
                <option value="revenue">Revenue Report</option>
                <option value="employee">Employee Report</option>
                <option value="order">Order Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">From Date</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">To Date</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2" />
            </div>
            <button onClick={generateReport} className="w-full bg-blue-600 text-white rounded-md py-2 hover:bg-blue-700">Generate Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}
