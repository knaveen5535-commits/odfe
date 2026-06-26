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
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-[#2B1D15] mb-6">Employees</h1>
        <div className="bg-surface rounded-lg shadow border border-border overflow-hidden">
          <table className="w-full">
            <thead className="bg-background"><tr>{['Code', 'Name', 'Role', 'Phone', 'Status'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-secondary-text uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-border">
              {employees.map(e => (
                <tr key={e.id} className="hover:bg-background">
                  <td className="px-6 py-4 font-mono text-sm text-[#2B1D15]">{e.employeeCode}</td>
                  <td className="px-6 py-4 font-medium text-[#2B1D15]">{e.name}</td>
                  <td className="px-6 py-4 text-secondary-text">{e.role.name}</td>
                  <td className="px-6 py-4 text-secondary-text">{e.phone || '-'}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${e.isActive ? 'bg-success/10 text-success' : 'bg-danger/10 text-danger'}`}>{e.isActive ? 'Active' : 'Inactive'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}