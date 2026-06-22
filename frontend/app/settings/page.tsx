'use client';
import Sidebar from '@/components/Navbar';

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        <div className="bg-white rounded-lg shadow p-6 max-w-lg">
          <p className="text-gray-500">System configuration will be available here.</p>
        </div>
      </div>
    </div>
  );
}
