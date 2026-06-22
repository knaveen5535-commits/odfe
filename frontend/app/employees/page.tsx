'use client';
import { useEffect, useState } from 'react';
import Sidebar from '@/components/Navbar';

interface Employee { id: string; name: string; employeeCode: string; phone: string; isActive: boolean; role: { name: string }; }

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/employees`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => d.success && setEmployees(d.data));
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Employees</h1>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50"><tr>{['Code', 'Name', 'Role', 'Phone', 'Status'].map(h => <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-200">
              {employees.map(e => (
                <tr key={e.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{e.employeeCode}</td>
                  <td className="px-6 py-4 font-medium">{e.name}</td>
                  <td className="px-6 py-4">{e.role.name}</td>
                  <td className="px-6 py-4">{e.phone || '-'}</td>
                  <td className="px-6 py-4"><span className={`px-2 py-1 rounded-full text-xs ${e.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{e.isActive ? 'Active' : 'Inactive'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
