'use client';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import { SplitSquareVertical, Users, Search, Receipt, Plus, Minus, ArrowRight } from 'lucide-react';

export default function SplitBillPage() {
  const [splitCount, setSplitCount] = useState(2);
  const totalAmount = 145.50;
  
  return (
    <div className="flex h-screen bg-[#F8F4EA] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="p-8 pb-4 flex-shrink-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#A56A2B] p-3 rounded-2xl shadow-lg shadow-[#A56A2B]/30 text-white">
                <SplitSquareVertical size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#2C1810]">Split Bill</h1>
                <p className="text-[#6B5B4F] font-medium">Divide payments evenly or by items</p>
              </div>
            </div>
          </div>
          
          <div className="relative mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-[#6B5B4F]" />
            </div>
            <input
              type="text"
              placeholder="Search active table or order reference..."
              className="block w-full pl-11 pr-4 py-3.5 bg-white border border-[#E7DDCF] rounded-2xl text-[#2C1810] font-medium placeholder-[#6B5B4F] focus:ring-2 focus:ring-[#A56A2B] focus:border-transparent shadow-sm transition-all"
            />
          </div>
        </div>

        <div className="flex-1 px-8 pb-8 overflow-y-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Order Details */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-[#E7DDCF] shadow-sm flex flex-col">
              <div className="flex items-center justify-between border-b border-[#E7DDCF] pb-4 mb-4">
                <h3 className="font-bold text-[#2C1810] flex items-center gap-2"><Receipt size={20} className="text-[#A56A2B]"/> Table 4 Order</h3>
                <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2 py-1 rounded-md">Pending</span>
              </div>
              <div className="flex-1 space-y-3 overflow-y-auto mb-4">
                {[
                  { item: 'Ribeye Steak', price: 45.00, qty: 2 },
                  { item: 'Truffle Fries', price: 12.50, qty: 1 },
                  { item: 'Red Wine (Glass)', price: 14.00, qty: 3 },
                  { item: 'Cheesecake', price: 1.00, qty: 1 } // adjusting for math 90+12.50+42+1 = 145.50
                ].map((i, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="font-medium text-[#2C1810]"><span className="text-[#6B5B4F] mr-1">{i.qty}x</span> {i.item}</span>
                    <span className="font-bold text-[#2C1810]">${(i.price * i.qty).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#E7DDCF] pt-4 mt-auto">
                <div className="flex justify-between items-center text-xl font-black text-[#2C1810]">
                  <span>Total</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Split Configuration */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white rounded-3xl p-8 border border-[#E7DDCF] shadow-sm">
                <h3 className="text-xl font-black text-[#2C1810] mb-6 flex items-center gap-2"><Users size={24} className="text-[#A56A2B]"/> How many ways?</h3>
                
                <div className="flex items-center justify-center gap-8 mb-8">
                  <button 
                    onClick={() => setSplitCount(Math.max(2, splitCount - 1))}
                    className="w-16 h-16 rounded-full bg-[#F8F4EA] text-[#A56A2B] flex items-center justify-center hover:bg-[#E7DDCF] transition-colors border border-[#E7DDCF]"
                  >
                    <Minus size={24} />
                  </button>
                  <div className="text-6xl font-black text-[#2C1810] w-20 text-center">{splitCount}</div>
                  <button 
                    onClick={() => setSplitCount(splitCount + 1)}
                    className="w-16 h-16 rounded-full bg-[#A56A2B] text-white flex items-center justify-center hover:bg-[#8B5A2B] shadow-lg shadow-[#A56A2B]/30 transition-transform hover:scale-105"
                  >
                    <Plus size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: splitCount }).map((_, i) => (
                    <div key={i} className="bg-gradient-to-br from-[#F8F4EA] to-white border border-[#E7DDCF] rounded-2xl p-4 text-center">
                      <p className="text-[#6B5B4F] text-xs font-bold uppercase mb-1">Guest {i + 1}</p>
                      <p className="text-2xl font-black text-[#A56A2B]">${(totalAmount / splitCount).toFixed(2)}</p>
                      <button className="mt-3 w-full py-2 bg-white border border-[#E7DDCF] rounded-lg text-sm font-bold text-[#2C1810] hover:border-[#A56A2B] transition-colors">
                        Pay Now
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-4">
                <button className="flex-1 bg-white border-2 border-[#E7DDCF] text-[#2C1810] font-black text-lg rounded-2xl py-4 hover:bg-gray-50 transition-colors">
                  Split by Items Instead
                </button>
                <button className="flex-1 bg-[#2C1810] text-white font-black text-lg rounded-2xl py-4 shadow-xl hover:bg-[#1a0f0a] transition-all flex items-center justify-center gap-2">
                  Confirm Split <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
