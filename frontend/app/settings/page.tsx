'use client';
import Sidebar from '@/components/Sidebar';

export default function SettingsPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto">
        <h1 className="text-2xl font-bold text-[#2B1D15] mb-6">Settings</h1>
        <div className="bg-surface rounded-lg shadow border border-border p-6 max-w-lg">
          <p className="text-secondary-text">System configuration will be available here.</p>
        </div>
      </div>
    </div>
  );
}