'use client';
import Link from 'next/link';
import styles from '../styles/pages/Landing.module.scss';

export default function LandingPage() {
  return (
    <div className={styles.landingPage}>
      {/* NAVBAR */}
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <Link href="/" className={styles.logo}>
            <svg width="120" height="36" viewBox="0 0 120 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Coffee bean icon */}
              <ellipse cx="16" cy="18" rx="12" ry="14" fill="#652304" />
              <path d="M16 6 C13 12, 13 24, 16 30" stroke="#E8E3D3" strokeWidth="1.5" fill="none" />
              <path d="M12 10 C14 14, 14 22, 12 26" stroke="#E8E3D3" strokeWidth="1" fill="none" opacity="0.5" />
              <path d="M20 10 C18 14, 18 22, 20 26" stroke="#E8E3D3" strokeWidth="1" fill="none" opacity="0.5" />
              {/* ODFE text */}
              <text x="34" y="24" fontFamily="Inter, system-ui, sans-serif" fontSize="20" fontWeight="800" fill="#2A2118" letterSpacing="-0.5">ODFE</text>
            </svg>
          </Link>
        </div>
        
        {/* Spacer is implicit via space-between */}
        
        <div className={styles.navRight}>
          <Link href="/login" className={styles.navLink}>
            Sign In
          </Link>
          <Link href="/login" className={styles.btnPrimary}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* HERO SECTION */}
      <section className={styles.heroSection}>
        <div className={styles.heroContainer}>
          
          {/* LEFT: Content */}
          <div className={styles.heroLeft}>
            <span className={styles.badge}>Modern Cafe Operations Platform</span>
            <h1 className={styles.mainHeading}>Run Your Cafe<br/>Beautifully.</h1>
            <h2 className={styles.subHeading}>
              Everything your team needs to serve customers faster, manage orders effortlessly, streamline kitchen operations, and grow your business from one beautifully designed platform.
            </h2>
            <p className={styles.description}>
              ODFE brings together Point of Sale, Kitchen Display, Customer Display, QR Ordering, Table Management, Payments, Reporting, and Analytics into one seamless experience built for modern cafes.
            </p>
            
            <div className={styles.buttonGroup}>
              <Link href="/login" className={styles.btnPrimaryLarge}>
                Explore Platform
              </Link>
              <Link href="#demo" className={styles.btnSecondary}>
                Watch Demo
              </Link>
            </div>
            
            <div className={styles.statsGrid}>
              <div className={styles.statItem}>
                <span className={styles.statValue}>500+</span>
                <span className={styles.statLabel}>Daily Orders</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>99.9%</span>
                <span className={styles.statLabel}>System Uptime</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>15+</span>
                <span className={styles.statLabel}>Integrated Modules</span>
              </div>
              <div className={styles.statItem}>
                <span className={styles.statValue}>100%</span>
                <span className={styles.statLabel}>Real Time Synchronization</span>
              </div>
            </div>
          </div>
          
          {/* RIGHT: Video Embed */}
          <div className={styles.heroRight}>
            <div className={styles.videoWrapper} id="demo">
              <iframe 
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
      <section className={styles.modulesSection}>
        <div className={styles.sectionHeader}>
          <h2>Core Modules</h2>
          <p>A comprehensive suite of tools designed specifically for the unique workflow of artisan cafes and premium coffee shops.</p>
        </div>
        
        <div className={styles.modulesGrid}>
          {[
            { title: 'Point of Sale', desc: 'Lightning fast ordering interface designed for touch.' },
            { title: 'Kitchen Display', desc: 'Streamline food prep with real-time digital tickets.' },
            { title: 'QR Ordering', desc: 'Allow customers to order and pay directly from their table.' },
            { title: 'Customer Display', desc: 'Transparent pricing and engaging promotional content.' },
            { title: 'Table Management', desc: 'Visual floor plans to optimize seating and turnover.' },
            { title: 'Payments', desc: 'Integrated processing for fast and secure transactions.' },
            { title: 'Coupons', desc: 'Drive loyalty with targeted promotions and discounts.' },
            { title: 'Reports', desc: 'Deep insights into sales, top products, and peak hours.' },
            { title: 'Bookings', desc: 'Manage reservations and private events effortlessly.' },
            { title: 'Analytics', desc: 'Data-driven decisions to grow your coffee business.' },
            { title: 'Settings', desc: 'Fully customizable configurations for your unique needs.' },
            { title: 'Employee Management', desc: 'Track hours, performance, and role-based access.' }
          ].map((module, i) => (
            <div key={i} className={styles.moduleCard}>
              <h3>{module.title}</h3>
              <p>{module.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className={styles.genericSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.secondaryHeading}>How It Works</h2>
          <p className={styles.sectionParagraph}>Seamless deployment from day one. Get your cafe running on ODFE in less than 24 hours.</p>
        </div>
        <div className={styles.gridThree}>
          <div className={styles.featureBox}>
            <h3>1. Configure</h3>
            <p>Set up your menu, modifiers, and table layouts in our intuitive backend. Everything syncs instantly.</p>
          </div>
          <div className={styles.featureBox}>
            <h3>2. Connect</h3>
            <p>Link your printers, payment terminals, and kitchen displays with zero technical knowledge required.</p>
          </div>
          <div className={styles.featureBox}>
            <h3>3. Serve</h3>
            <p>Start taking orders immediately. Train your staff in minutes, not days, with our touch-first interface.</p>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE ODFE SECTION */}
      <section className={styles.genericSection}>
        <div className={styles.gridTwo}>
          <div>
            <h2 className={styles.secondaryHeading}>Why Choose ODFE</h2>
            <p className={styles.sectionParagraph}>
              Unlike generic point of sale systems, ODFE is built exclusively for the high-volume, fast-paced environment of premium cafes. We understand that in coffee, seconds matter.
            </p>
            <div className={styles.buttonGroup}>
              <Link href="/login" className={styles.btnSecondary}>Read Our Story</Link>
            </div>
          </div>
          <div className={styles.videoWrapper} style={{ paddingBottom: '75%' }}>
            {/* A premium lifestyle cafe image placeholder or video */}
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg-primary)' }}>
              Premium Cafe Operations
            </div>
          </div>
        </div>
      </section>

      {/* CUSTOMER EXPERIENCE SECTION */}
      <section className={styles.genericSection}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.secondaryHeading}>Elevate the Customer Experience</h2>
          <p className={styles.sectionParagraph}>From the moment they walk in to the moment they leave, provide a seamless, modern ordering experience.</p>
        </div>
        <div className={styles.gridThree}>
          <div className={styles.featureBox}>
            <h3>Order at Table</h3>
            <p>Customers can scan, order, and pay without waiting in line. Tickets print directly to your barista.</p>
          </div>
          <div className={styles.featureBox}>
            <h3>Digital Loyalty</h3>
            <p>Reward your best customers automatically. Integrated loyalty programs that actually work.</p>
          </div>
          <div className={styles.featureBox}>
            <h3>Customer Display</h3>
            <p>Beautiful, branded screens that confirm orders and upsell pastries with mouth-watering photography.</p>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.ctaSection}>
        <h2 className={styles.ctaHeading}>Ready to elevate your cafe?</h2>
        <p className={styles.ctaText}>Join hundreds of premium cafes running their operations beautifully on ODFE.</p>
        <Link href="/login" className={styles.btnCta}>Get Started Today</Link>
      </section>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <p>© {new Date().getFullYear()} ODFE Cafe POS. Premium operations platform.</p>
      </footer>
    </div>
  );
}
