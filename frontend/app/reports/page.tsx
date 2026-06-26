'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';

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
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-[#2B1D15] mb-6">Reports</h1>
        <div className="bg-surface rounded-lg shadow border border-border p-6 max-w-lg">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#2B1D15]">Report Type</label>
              <select value={reportType} onChange={e => setReportType(e.target.value)} className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-[#2B1D15] bg-background">
                <option value="sales">Sales Report</option>
                <option value="revenue">Revenue Report</option>
                <option value="employee">Employee Report</option>
                <option value="order">Order Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2B1D15]">From Date</label>
              <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-[#2B1D15] bg-background" />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#2B1D15]">To Date</label>
              <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="mt-1 block w-full rounded-md border border-border px-3 py-2 text-[#2B1D15] bg-background" />
            </div>
            <button onClick={generateReport} className="w-full bg-primary text-white rounded-md py-2 hover:bg-primary-hover transition">Generate Report</button>
          </div>
        </div>
      </div>
    </div>
  );
}