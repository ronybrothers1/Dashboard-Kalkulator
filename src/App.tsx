import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { DashboardLayout } from './layouts/DashboardLayout/DashboardLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';

const Splash = ({ onEnter }: { onEnter: () => void }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleEnter();
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  const handleEnter = () => {
    setIsVisible(false);
    setTimeout(onEnter, 600);
  };

  if (!isVisible) return null;

  return (
    <div 
      id="splash" 
      role="dialog" 
      aria-modal="true" 
      aria-label="Selamat datang di Rony Brothers Portal"
      style={{
        position: 'fixed', inset: 0, zIndex: 600, background: 'var(--blue-900)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 36,
        cursor: 'pointer', transition: 'opacity 0.6s ease, visibility 0.6s ease',
        opacity: isVisible ? 1 : 0
      }}
      onClick={handleEnter}
    >
      <div className="splash-glow" aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 55% at 50% 45%,rgba(45,142,255,0.10) 0%,transparent 65%)' }} />
      <div className="splash-mark" aria-hidden="true" style={{ width: 80, height: 80, borderRadius: 22, background: 'linear-gradient(145deg,var(--blue-600),var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 0 1px rgba(45,142,255,0.25),0 0 60px rgba(45,142,255,0.3),var(--sh-lg)' }}>
        <span className="splash-mark-text" style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}>RB</span>
      </div>
      <div className="splash-headline" style={{ textAlign: 'center' }}>
        <h1 className="splash-title" style={{ fontSize: 'clamp(24px,4vw,38px)', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: -1, lineHeight: 1.1 }}>Rony <span style={{ color: 'var(--accent-light)' }}>Brothers</span></h1>
        <p className="splash-sub" style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: 'var(--text-muted)', letterSpacing: 2.5, textTransform: 'uppercase', marginTop: 8 }}>Portal Resmi · v2.4.1</p>
      </div>
      <button 
        className="splash-enter" 
        onClick={(e) => { e.stopPropagation(); handleEnter(); }}
        aria-label="Masuk ke portal"
        style={{
          display: 'flex', alignItems: 'center', gap: 10, background: 'rgba(45,142,255,0.10)', border: '1px solid rgba(45,142,255,0.25)',
          borderRadius: 50, padding: '13px 30px', fontFamily: "'Plus Jakarta Sans',sans-serif", fontSize: 14, fontWeight: 600,
          color: 'var(--accent-light)', cursor: 'pointer', transition: 'background 0.2s ease,border-color 0.2s ease,color 0.2s ease,transform 0.2s ease'
        }}
      >
        <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ width: 18, height: 18, opacity: 0.8, flexShrink: 0 }}>
          <path d="M3.5 9h11M9.5 4l5 5-5 5"/>
        </svg>
        Masuk ke Portal
      </button>
    </div>
  );
};

const AppContent = () => {
  const { showToast } = useToast();
  const [showSplash, setShowSplash] = useState(true);

  useEffect(() => {
    if (!showSplash) {
      showToast('[OK] Portal aktif — selamat datang', 'ok', 400);
      showToast('[INFO] Memuat modul portal…', 'info', 1800);
      showToast('[OK] Enkripsi AES-256 aktif', 'ok', 3200);
    }
  }, [showSplash, showToast]);

  return (
    <>
      {showSplash && <Splash onEnter={() => setShowSplash(false)} />}
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
}
