'use client';
import { ShieldAlert, Server, Users, Activity, Settings, Database, HardDrive, Cpu } from 'lucide-react';
import Sidebar from '@/components/Sidebar';

export default function SystemAdminDashboard() {
  return (
    <div className="flex h-screen bg-[#F8F4EA] font-sans selection:bg-[#A56A2B] selection:text-white">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">
        
        <div className="p-8 pb-4">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-gray-800 to-black p-3 rounded-2xl shadow-sm-lg shadow-sm-black/30 text-white">
                <ShieldAlert size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#2C1810]">System Administration</h1>
                <p className="text-[#6B5B4F] font-medium">Manage global settings, tenants, and infrastructure</p>
              </div>
            </div>
          </div>

          {/* Infrastructure Health */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'System Status', value: 'Healthy', icon: Activity, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
              { label: 'Active Tenants', value: '142', icon: Server, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
              { label: 'Total Users', value: '2,845', icon: Users, color: 'text-[#A56A2B]', bg: 'bg-[#F8F4EA]', border: 'border-[#A56A2B]/20' },
              { label: 'Database Load', value: '24%', icon: Database, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
            ].map((stat, i) => (
              <div key={i} className={`bg-white p-6 rounded-3xl border shadow-sm ${stat.border}`}>
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={24} />
                  </div>
                </div>
                <h3 className="text-2xl font-black text-[#2C1810] mb-1">{stat.value}</h3>
                <p className="text-[#6B5B4F] text-sm font-bold uppercase tracking-wider">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* System Metrics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <div className="bg-white rounded-3xl p-8 border border-[#E7DDCF] shadow-sm">
              <h2 className="text-xl font-black text-[#2C1810] mb-6 flex items-center gap-2"><Cpu className="text-[#A56A2B]"/> Server Resources</h2>
              <div className="space-y-6">
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-[#6B5B4F]">CPU Usage</span>
                    <span className="text-[#2C1810]">42%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-[#6B5B4F]">Memory (RAM)</span>
                    <span className="text-[#2C1810]">12.4 GB / 32 GB</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '38%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm font-bold mb-2">
                    <span className="text-[#6B5B4F]">Storage</span>
                    <span className="text-[#2C1810]">842 GB / 2 TB</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-amber-500 h-2 rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-[#E7DDCF] shadow-sm">
              <h2 className="text-xl font-black text-[#2C1810] mb-6 flex items-center gap-2"><HardDrive className="text-[#A56A2B]"/> Recent Audit Logs</h2>
              <div className="space-y-4">
                {[
                  { action: 'Tenant Created', entity: 'Cafe Mocha', time: '10 mins ago', user: 'admin@odfe.local' },
                  { action: 'Global Setting Updated', entity: 'Tax Rate', time: '1 hour ago', user: 'sysadmin@odfe.local' },
                  { action: 'Database Backup', entity: 'System', time: '3 hours ago', user: 'Automated' },
                  { action: 'Role Permission Changed', entity: 'Cashier Role', time: '5 hours ago', user: 'admin@odfe.local' },
                ].map((log, i) => (
                  <div key={i} className="flex justify-between items-center p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
                    <div>
                      <h4 className="font-bold text-[#2C1810]">{log.action}</h4>
                      <p className="text-sm font-medium text-gray-500">{log.entity} • by {log.user}</p>
                    </div>
                    <span className="text-xs font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-3xl">{log.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
