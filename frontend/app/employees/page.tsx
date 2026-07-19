'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Sidebar';

interface Employee { id: string; name: string; employeeCode: string; phone: string; isActive: boolean; role: { name: string }; }

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => d.success && setEmployees(d.data));
  }, []);

  return (
    <div className="flex h-screen bg-[#F8F4EA]">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-[#2C1810] mb-6">Employees</h1>
        <div className="bg-white rounded-3xl shadow-sm border border-[#E7DDCF] overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#F8F4EA]"><tr>{['Code', 'Name', 'Role', 'Phone', 'Status'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-[#6B5B4F] uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {employees.map(e => (
                <tr key={e.id} className="hover:bg-[#F8F4EA]">
                  <td className="px-6 py-4 font-mono text-sm text-[#2C1810]">{e.employeeCode}</td>
                  <td className="px-6 py-4 font-medium text-[#2C1810]">{e.name}</td>
                  <td className="px-6 py-4 text-[#6B5B4F]">{e.role.name}</td>
                  <td className="px-6 py-4 text-[#6B5B4F]">{e.phone || '-'}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${e.isActive ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>{e.isActive ? 'Active' : 'Inactive'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}