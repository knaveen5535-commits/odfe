'use client';
import Sidebar from '@/components/Sidebar';
import { Receipt, Printer, Download, Search, CheckCircle2 } from 'lucide-react';

export default function ReceiptPage() {
  return (
    <div className="flex h-screen bg-[#F8F4EA] font-sans">
      <Sidebar />
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        <div className="p-8 pb-4 flex-shrink-0">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-4">
              <div className="bg-[#A56A2B] p-3 rounded-2xl shadow-lg shadow-[#A56A2B]/30 text-white">
                <Receipt size={32} />
              </div>
              <div>
                <h1 className="text-3xl font-black text-[#2C1810]">Receipts</h1>
                <p className="text-[#6B5B4F] font-medium">Generate and reprint digital receipts</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-[#6B5B4F]" />
                <input
                  type="text"
                  placeholder="Order ID or Table..."
                  className="pl-10 pr-4 py-2 bg-white border border-[#E7DDCF] rounded-xl text-sm font-bold text-[#2C1810] focus:ring-2 focus:ring-[#A56A2B] outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 px-8 pb-8 flex justify-center overflow-y-auto">
          {/* Virtual Receipt Display */}
          <div className="w-full max-w-md bg-white rounded-t-3xl rounded-b-xl shadow-2xl flex flex-col overflow-hidden border border-[#E7DDCF] relative">
            <div className="absolute top-0 left-0 right-0 h-4 bg-gradient-to-r from-[#A56A2B] to-[#D97706]"></div>
            
            <div className="p-8 flex-1">
              <div className="text-center mb-8 mt-2">
                <div className="w-16 h-16 bg-[#F8F4EA] rounded-full mx-auto flex items-center justify-center text-[#A56A2B] mb-3">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-black text-[#2C1810] tracking-tight">ODFE Kitchen</h2>
                <p className="text-[#6B5B4F] text-sm font-medium mt-1">123 Culinary Avenue, NY 10001<br/>Tel: (555) 123-4567</p>
              </div>

              <div className="border-t border-dashed border-gray-300 py-4 mb-4 flex justify-between text-sm font-bold text-[#6B5B4F]">
                <div>
                  <p>Order #ORD-8821</p>
                  <p>Table 04</p>
                </div>
                <div className="text-right">
                  <p>Oct 24, 2026</p>
                  <p>19:42 PM</p>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-start text-sm">
                  <div className="font-bold text-[#2C1810]">
                    2x Ribeye Steak
                    <div className="text-xs text-[#6B5B4F] font-medium mt-0.5">Medium Rare</div>
                  </div>
                  <div className="font-black text-[#2C1810]">$90.00</div>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <div className="font-bold text-[#2C1810]">
                    1x Truffle Fries
                  </div>
                  <div className="font-black text-[#2C1810]">$12.50</div>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <div className="font-bold text-[#2C1810]">
                    3x Red Wine (Glass)
                  </div>
                  <div className="font-black text-[#2C1810]">$42.00</div>
                </div>
                <div className="flex justify-between items-start text-sm">
                  <div className="font-bold text-[#2C1810]">
                    1x Cheesecake
                  </div>
                  <div className="font-black text-[#2C1810]">$7.50</div>
                </div>
              </div>

              <div className="border-t border-dashed border-gray-300 pt-4 space-y-2">
                <div className="flex justify-between text-[#6B5B4F] font-bold text-sm">
                  <span>Subtotal</span><span>$152.00</span>
                </div>
                <div className="flex justify-between text-[#6B5B4F] font-bold text-sm">
                  <span>Tax (8.875%)</span><span>$13.49</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-[#2C1810] mt-2 pt-2 border-t border-gray-100">
                  <span>Total</span><span>$165.49</span>
                </div>
              </div>
              
              <div className="mt-8 text-center text-sm font-bold text-[#6B5B4F]">
                <p>Payment Method: <span className="text-[#2C1810]">Visa **** 4242</span></p>
                <p className="mt-4 italic">Thank you for dining with us!</p>
              </div>
            </div>

            {/* Jagged Bottom Edge Effect */}
            <div className="h-4 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIxMCI+PHBvbHlnb24gcG9pbnRzPSIwLDEwIDEwLDAgMjAsMTAiIGZpbGw9IiNGOEY0RUEiLz48L3N2Zz4=')] bg-repeat-x"></div>
            
            <div className="bg-[#F8F4EA] p-4 flex gap-3 border-t border-[#E7DDCF]/50">
              <button className="flex-1 flex justify-center items-center gap-2 py-3 bg-white border border-[#E7DDCF] rounded-xl text-sm font-bold text-[#2C1810] hover:bg-gray-50 transition-colors shadow-sm">
                <Download size={18} /> PDF
              </button>
              <button className="flex-1 flex justify-center items-center gap-2 py-3 bg-[#2C1810] rounded-xl text-sm font-bold text-white hover:bg-[#1a0f0a] transition-colors shadow-lg">
                <Printer size={18} /> Print
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
