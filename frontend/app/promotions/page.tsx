'use client';
import Sidebar from '@/components/Sidebar';
import { Megaphone, Sparkles, ArrowRight } from 'lucide-react';

export default function PromotionsPage() {
  return (
    <div className="flex h-screen bg-[#F8F4EA] font-sans text-[#2C1810]">
      <Sidebar />
      <div className="flex-1 p-8 overflow-auto flex flex-col">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <div className="bg-gradient-to-br from-[#A56A2B] to-[#8B5A2B] p-3 rounded-2xl shadow-lg text-white">
              <Megaphone size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">Promotions</h1>
              <p className="text-[#6B5B4F] font-medium">Manage and configure this module</p>
            </div>
          </div>
        </div>
        
        <div className="flex-1 bg-white/70 backdrop-blur-xl rounded-3xl p-12 border border-white shadow-xl flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#A56A2B] to-transparent opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-amber-500 to-transparent opacity-5 rounded-full -ml-32 -mb-32"></div>
          
          <div className="bg-[#F8F4EA] p-6 rounded-full mb-6 relative z-10 shadow-inner">
            <Sparkles size={48} className="text-[#A56A2B]" />
          </div>
          <h2 className="text-3xl font-extrabold mb-4 relative z-10">Promotions Workspace</h2>
          <p className="text-[#6B5B4F] text-center max-w-lg mb-8 relative z-10 text-lg">
            This module is structured and ready for premium data integration. The UI components are scaffolded and aligned with the overarching design system.
          </p>
          <button className="flex items-center gap-2 bg-[#2C1810] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#4A2C1D] transition-colors shadow-lg relative z-10">
            Configure Promotions <ArrowRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
