'use client';
import Sidebar from '@/components/Sidebar';

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-[#F8F4EA]">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-[#2C1810] mb-6">Settings</h1>
        <div className="bg-white rounded-3xl shadow-sm border border-[#E7DDCF] p-6 max-w-lg">
          <p className="text-[#6B5B4F]">System configuration will be available here.</p>
        </div>
      </div>
    </div>
  );
}