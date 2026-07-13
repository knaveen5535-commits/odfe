'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getRedirectPath } from '@/context/AuthContext';
import { 
  Coffee, ArrowRight, LayoutDashboard, UtensilsCrossed, 
  Smartphone, Monitor, Table2, CreditCard, Ticket, 
  BarChart3, Calendar, Settings, Users, PlayCircle, Star
} from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    async function validateSession() {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'}/auth/profile`,
          { headers: { Authorization: `Bearer ${token}` }, credentials: 'include' },
        );
        const data = await res.json();
        if (data.success) {
          const user = data.data?.user || data.user;
          if (user) {
            const path = getRedirectPath(user.role, user.department);
            router.replace(path);
            return;
          }
        }
      } catch {
        const userStr = localStorage.getItem('user');
        if (token && userStr) {
          try {
            const user = JSON.parse(userStr);
            router.replace(getRedirectPath(user.role, user.department));
            return;
          } catch { /* ignore parse errors */ }
        }
      }

      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('department');
    }

    validateSession();
  }, [router]);

  return (
    <div className="min-h-screen bg-[#F8F4EA] font-sans selection:bg-[#A56A2B] selection:text-white">
      {/* Dynamic Background Gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-[#A56A2B]/10 blur-[120px]"></div>
        <div className="absolute top-[40%] -right-[10%] w-[40%] h-[60%] rounded-full bg-[#D97706]/10 blur-[120px]"></div>
      </div>

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-[#E7DDCF] shadow-sm py-4' : 'bg-transparent py-6'}`}>
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-br from-[#A56A2B] to-[#8B5A2B] p-2 rounded-xl text-white shadow-lg shadow-[#A56A2B]/20 group-hover:scale-105 transition-transform">
              <Coffee size={24} />
            </div>
            <span className="text-2xl font-black text-[#2C1810] tracking-tight">ODFE</span>
          </Link>
          
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-[#6B5B4F] font-bold hover:text-[#A56A2B] transition-colors">
              Sign In
            </Link>
            <Link href="/login" className="bg-[#2C1810] text-white px-6 py-2.5 rounded-full font-bold shadow-lg shadow-black/10 hover:bg-[#1a0f0a] hover:scale-105 transition-all">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      <main className="relative z-10 pt-32 pb-20">
        
        {/* HERO SECTION */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-[#E7DDCF] shadow-sm text-sm font-bold text-[#A56A2B]">
                <Star size={16} className="fill-current" /> Modern Cafe Operations Platform
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-[#2C1810] leading-[1.1] tracking-tight">
                Run Your Cafe <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#A56A2B] to-[#D97706]">Beautifully.</span>
              </h1>
              
              <p className="text-xl text-[#6B5B4F] leading-relaxed font-medium max-w-xl">
                Everything your team needs to serve customers faster, manage orders effortlessly, streamline kitchen operations, and grow your business from one exquisitely designed platform.
              </p>
              
              <div className="flex flex-wrap items-center gap-4 pt-4">
                <Link href="/login" className="flex items-center gap-2 bg-gradient-to-r from-[#A56A2B] to-[#8B5A2B] text-white px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-[#A56A2B]/30 hover:shadow-2xl hover:-translate-y-1 transition-all">
                  Explore Platform <ArrowRight size={20} />
                </Link>
                <Link href="#demo" className="flex items-center gap-2 bg-white text-[#2C1810] px-8 py-4 rounded-full font-bold text-lg shadow-md border border-[#E7DDCF] hover:bg-gray-50 transition-all">
                  <PlayCircle size={20} className="text-[#A56A2B]" /> Watch Demo
                </Link>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-12 border-t border-[#E7DDCF]/50">
                {[
                  { value: '500+', label: 'Daily Orders' },
                  { value: '99.9%', label: 'Uptime' },
                  { value: '15+', label: 'Modules' },
                  { value: '100%', label: 'Real-time' }
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-black text-[#2C1810]">{stat.value}</div>
                    <div className="text-sm font-bold text-[#6B5B4F] mt-1 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-4 bg-gradient-to-br from-[#A56A2B]/20 to-[#D97706]/20 rounded-[2.5rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-70"></div>
              <div className="relative bg-white rounded-[2rem] p-3 shadow-2xl border border-white/50 aspect-video overflow-hidden" id="demo">
                <iframe 
                  className="w-full h-full rounded-2xl"
                  src="https://www.youtube.com/embed/vA_ptd7F0h4?autoplay=1&mute=1&loop=1&playlist=vA_ptd7F0h4&controls=0&rel=0" 
                  title="ODFE Cafe POS Demo" 
                  allow="autoplay; encrypted-media" 
                  allowFullScreen
                ></iframe>
              </div>
            </div>
            
          </div>
        </section>

        {/* CORE MODULES SECTION */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-[#2C1810] mb-6">A Suite of Powerful Modules</h2>
            <p className="text-lg text-[#6B5B4F] font-medium">A comprehensive suite of tools designed specifically for the unique workflow of artisan cafes and premium coffee shops.</p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: LayoutDashboard, title: 'Point of Sale', desc: 'Lightning fast ordering interface designed for touch.' },
              { icon: UtensilsCrossed, title: 'Kitchen Display', desc: 'Streamline food prep with real-time digital tickets.' },
              { icon: Smartphone, title: 'QR Ordering', desc: 'Allow customers to order and pay directly from their table.' },
              { icon: Monitor, title: 'Customer Display', desc: 'Transparent pricing and engaging promotional content.' },
              { icon: Table2, title: 'Table Management', desc: 'Visual floor plans to optimize seating and turnover.' },
              { icon: CreditCard, title: 'Payments', desc: 'Integrated processing for fast and secure transactions.' },
              { icon: Ticket, title: 'Coupons', desc: 'Drive loyalty with targeted promotions and discounts.' },
              { icon: BarChart3, title: 'Reports & Analytics', desc: 'Deep insights into sales, top products, and peak hours.' },
              { icon: Calendar, title: 'Bookings', desc: 'Manage reservations and private events effortlessly.' },
            ].map((module, i) => (
              <div key={i} className="bg-white/60 backdrop-blur-lg rounded-3xl p-8 border border-white shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-default">
                <div className="w-14 h-14 rounded-2xl bg-[#F8F4EA] flex items-center justify-center text-[#A56A2B] mb-6 group-hover:scale-110 group-hover:bg-[#A56A2B] group-hover:text-white transition-all">
                  <module.icon size={28} />
                </div>
                <h3 className="text-xl font-black text-[#2C1810] mb-3">{module.title}</h3>
                <p className="text-[#6B5B4F] font-medium leading-relaxed">{module.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section className="bg-white py-32 border-y border-[#E7DDCF] mb-32 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-4xl md:text-5xl font-black text-[#2C1810] mb-6">Deployed in 24 hours.</h2>
                <p className="text-lg text-[#6B5B4F] font-medium mb-12">Seamless deployment from day one. Get your cafe running on ODFE incredibly fast without the technical headaches.</p>
                
                <div className="space-y-8">
                  {[
                    { num: '1', title: 'Configure', desc: 'Set up your menu, modifiers, and table layouts in our intuitive backend. Everything syncs instantly.' },
                    { num: '2', title: 'Connect', desc: 'Link your printers, payment terminals, and kitchen displays with zero technical knowledge required.' },
                    { num: '3', title: 'Serve', desc: 'Start taking orders immediately. Train your staff in minutes, not days, with our touch-first interface.' },
                  ].map((step, i) => (
                    <div key={i} className="flex gap-6">
                      <div className="w-12 h-12 shrink-0 rounded-full bg-[#F8F4EA] text-[#A56A2B] flex items-center justify-center text-xl font-black border border-[#E7DDCF]">
                        {step.num}
                      </div>
                      <div>
                        <h3 className="text-xl font-black text-[#2C1810] mb-2">{step.title}</h3>
                        <p className="text-[#6B5B4F] font-medium leading-relaxed">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative">
                <div className="aspect-square bg-gradient-to-br from-[#A56A2B]/10 to-[#F8F4EA] rounded-full absolute -inset-10 blur-3xl opacity-50"></div>
                <div className="relative bg-[#F8F4EA] rounded-[3rem] p-12 border border-[#E7DDCF] shadow-2xl flex flex-col items-center text-center">
                  <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-lg text-[#A56A2B] mb-8">
                    <Coffee size={48} />
                  </div>
                  <h3 className="text-3xl font-black text-[#2C1810] mb-4">Built for Coffee.</h3>
                  <p className="text-[#6B5B4F] font-medium leading-relaxed">Unlike generic point of sale systems, ODFE is built exclusively for the high-volume, fast-paced environment of premium cafes. We understand that in coffee, seconds matter.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="max-w-5xl mx-auto px-6 text-center">
          <div className="bg-gradient-to-br from-[#2C1810] to-[#1a0f0a] rounded-[3rem] p-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#A56A2B] rounded-full blur-[100px] opacity-30"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#D97706] rounded-full blur-[100px] opacity-20"></div>
            
            <div className="relative z-10">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">Ready to elevate your cafe?</h2>
              <p className="text-xl text-gray-300 font-medium mb-10 max-w-2xl mx-auto">Join hundreds of premium cafes running their operations beautifully on ODFE.</p>
              <Link href="/login" className="inline-flex items-center gap-2 bg-white text-[#2C1810] px-10 py-5 rounded-full font-black text-lg shadow-xl hover:bg-gray-100 hover:scale-105 transition-all">
                Get Started Today <ArrowRight size={20} />
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#E7DDCF] py-12 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Coffee size={24} className="text-[#A56A2B]" />
            <span className="text-2xl font-black text-[#2C1810]">ODFE</span>
          </div>
          <p className="text-[#6B5B4F] font-medium">© {new Date().getFullYear()} ODFE Cafe POS. Premium operations platform.</p>
        </div>
      </footer>
    </div>
  );
}
