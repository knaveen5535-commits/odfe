'use client';
import { useState, useEffect, useCallback } from 'react';
import Sidebar from '@/components/Sidebar';
import { Search, ShoppingBag, Trash2, Plus, Minus, CreditCard, Banknote, QrCode } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  salePrice: number;
  category?: { name: string };
  image?: string;
}

interface CartItem {
  productId: string;
  name: string;
  qty: number;
  price: number;
}

export default function POSPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.success) setProducts(d.data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const addToCart = useCallback((product: Product) => {
    setCart(prev => {
      const existing = prev.find(i => i.productId === product.id);
      if (existing) {
        return prev.map(i => i.productId === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { productId: product.id, name: product.name, qty: 1, price: product.salePrice }];
    });
  }, []);

  const updateQty = useCallback((productId: string, delta: number) => {
    setCart(prev => prev.map(i => i.productId === productId ? { ...i, qty: i.qty + delta } : i).filter(i => i.qty > 0));
  }, []);

  const clearCart = () => setCart([]);

  const categories = Array.from(new Set(products.map(p => p.category?.name || 'Uncategorized')));
  
  const filteredProducts = products.filter(p => {
    const matchesCat = activeCategory === 'all' || (p.category?.name || 'Uncategorized') === activeCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const subtotal = cart.reduce((s, i) => s + i.qty * i.price, 0);
  const tax = subtotal * 0.1; // 10% mock tax
  const total = subtotal + tax;

  const placeOrder = async () => {
    if (!selectedPayment) return;
    const token = localStorage.getItem('accessToken');
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({
        items: cart.map(i => ({ product_id: i.productId, qty: i.qty, price: i.price })),
        payment_method: selectedPayment,
      }),
    });
    const data = await res.json();
    if (data.success) {
      setCart([]);
      setSelectedPayment('');
    }
  };

  return (
    <div className="flex h-screen bg-[#F8F4EA] font-sans">
      <Sidebar />
      <div className="flex-1 flex overflow-hidden">
        
        {/* Main Content Area */}
        <div className="flex-1 flex flex-col h-full bg-[#F8F4EA] relative z-0">
          {/* Header */}
          <div className="px-8 pt-8 pb-4 flex justify-between items-center shrink-0">
            <div>
              <h1 className="text-3xl font-black text-[#2C1810]">Point of Sale</h1>
              <p className="text-[#6B5B4F] font-medium">Quick tap to add items to cart</p>
            </div>
            <div className="relative w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B5B4F] w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white rounded-2xl shadow-sm border border-[#E7DDCF] focus:ring-2 focus:ring-[#A56A2B] outline-none transition-shadow text-[#2C1810] font-bold"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="px-8 pb-6 overflow-x-auto no-scrollbar shrink-0">
            <div className="flex gap-3">
              <button
                onClick={() => setActiveCategory('all')}
                className={`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${activeCategory === 'all' ? 'bg-[#A56A2B] text-white shadow-lg shadow-[#A56A2B]/40 transform scale-105' : 'bg-white text-[#6B5B4F] border border-[#E7DDCF] hover:bg-gray-50'}`}
              >
                All Items
              </button>
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-6 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-[#A56A2B] text-white shadow-lg shadow-[#A56A2B]/40 transform scale-105' : 'bg-white text-[#6B5B4F] border border-[#E7DDCF] hover:bg-gray-50'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Product Grid */}
          <div className="flex-1 px-8 pb-8 overflow-y-auto">
            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1,2,3,4,5,6,7,8].map(i => <div key={i} className="animate-pulse bg-white rounded-3xl h-56 shadow-sm border border-[#E7DDCF]"></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 pb-20">
                {filteredProducts.map(product => (
                  <button 
                    key={product.id} 
                    onClick={() => addToCart(product)}
                    className="group bg-white rounded-3xl p-4 flex flex-col text-left shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-[#E7DDCF] hover:border-[#A56A2B]/30 relative overflow-hidden active:scale-95"
                  >
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#A56A2B]/10 to-transparent rounded-bl-full -mr-4 -mt-4 transition-transform group-hover:scale-125"></div>
                    
                    <div className="w-full aspect-[4/3] bg-[#F8F4EA] rounded-2xl mb-4 flex items-center justify-center relative overflow-hidden">
                      {/* Product Image Placeholder - You can replace with actual img tag if product.image exists */}
                      <span className="text-4xl">🍲</span>
                    </div>
                    
                    <h3 className="font-bold text-[#2C1810] text-lg leading-tight mb-1">{product.name}</h3>
                    <p className="text-[#A56A2B] font-black text-xl mt-auto">${product.salePrice.toFixed(2)}</p>
                  </button>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="col-span-full py-20 text-center text-[#6B5B4F]">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-xl font-bold text-[#2C1810]">No products found</h3>
                    <p>Try adjusting your search or category filter.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Cart Sidebar (Floating Glassmorphic Panel) */}
        <div className="w-96 shrink-0 h-full p-4 pl-0">
          <div className="bg-white/80 backdrop-blur-xl h-full rounded-[2rem] shadow-2xl border border-white/50 flex flex-col relative overflow-hidden">
            
            <div className="p-6 pb-4 border-b border-[#E7DDCF]/50 flex justify-between items-center bg-white/50">
              <h2 className="text-2xl font-black text-[#2C1810] flex items-center gap-2">
                <ShoppingBag className="text-[#A56A2B]" /> Current Order
              </h2>
              {cart.length > 0 && (
                <button onClick={clearCart} className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors">
                  <Trash2 size={20} />
                </button>
              )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                  <ShoppingBag size={64} className="text-[#A56A2B] mb-4" />
                  <p className="font-bold text-[#2C1810] text-lg">Cart is empty</p>
                  <p className="text-sm text-[#6B5B4F]">Tap products to add them to the order</p>
                </div>
              ) : (
                cart.map(item => (
                  <div key={item.productId} className="bg-white p-4 rounded-2xl shadow-sm border border-[#E7DDCF] flex items-center justify-between gap-4 group">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[#2C1810] truncate">{item.name}</h4>
                      <p className="text-[#A56A2B] font-black">${(item.price * item.qty).toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-3 bg-[#F8F4EA] rounded-full p-1 border border-[#E7DDCF]">
                      <button onClick={() => updateQty(item.productId, -1)} className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#2C1810] shadow-sm hover:text-[#A56A2B] active:scale-90 transition-all"><Minus size={16} strokeWidth={3}/></button>
                      <span className="font-black text-[#2C1810] w-4 text-center">{item.qty}</span>
                      <button onClick={() => updateQty(item.productId, 1)} className="w-8 h-8 rounded-full bg-[#A56A2B] flex items-center justify-center text-white shadow-sm hover:bg-[#8B5A2B] active:scale-90 transition-all"><Plus size={16} strokeWidth={3}/></button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Payment Section */}
            <div className="bg-white p-6 border-t border-[#E7DDCF]/50 shadow-[0_-10px_40px_rgba(0,0,0,0.05)]">
              <div className="space-y-2 mb-6">
                <div className="flex justify-between text-[#6B5B4F] font-bold">
                  <span>Subtotal</span><span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#6B5B4F] font-bold">
                  <span>Tax (10%)</span><span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#2C1810] text-2xl font-black pt-2 border-t border-[#E7DDCF]">
                  <span>Total</span><span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 mb-6">
                {[
                  { id: 'Cash', icon: Banknote },
                  { id: 'Card', icon: CreditCard },
                  { id: 'QR', icon: QrCode },
                ].map(method => (
                  <button
                    key={method.id}
                    onClick={() => setSelectedPayment(method.id)}
                    className={`py-3 flex flex-col items-center justify-center gap-1 rounded-xl font-bold transition-all border-2 ${
                      selectedPayment === method.id 
                        ? 'border-[#A56A2B] bg-[#A56A2B]/10 text-[#A56A2B]' 
                        : 'border-[#E7DDCF] bg-[#F8F4EA] text-[#6B5B4F] hover:bg-white hover:border-[#A56A2B]/50'
                    }`}
                  >
                    <method.icon size={20} />
                    <span className="text-xs uppercase tracking-wider">{method.id}</span>
                  </button>
                ))}
              </div>

              <button
                disabled={cart.length === 0 || !selectedPayment}
                onClick={placeOrder}
                className="w-full py-4 bg-gradient-to-r from-[#A56A2B] to-[#8B5A2B] text-white text-xl font-black rounded-2xl shadow-xl shadow-[#A56A2B]/30 transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {cart.length === 0 ? 'Cart is Empty' : !selectedPayment ? 'Select Payment' : `Pay $${total.toFixed(2)}`}
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
