import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastProvider, useToast } from './contexts/ToastContext';
import { DashboardLayout } from './layouts/DashboardLayout/DashboardLayout';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { ErrorBoundary } from './components/ErrorBoundary';

// ── Splash ────────────────────────────────────────────────────────────────────
interface SplashProps {
  onEnter: () => void;
}

const Splash: React.FC<SplashProps> = ({ onEnter }) => {
  const [fading, setFading] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleEnter = () => {
    if (fading) return;
    setFading(true);
    timerRef.current = setTimeout(onEnter, 550);
  };

  useEffect(() => {
    // Auto-dismiss after 4 s
    timerRef.current = setTimeout(handleEnter, 4000);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Selamat datang di Rony Brothers Portal"
      onClick={handleEnter}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 'var(--z-splash)' as any,
        background: 'var(--blue-900)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 36,
        cursor: 'pointer',
        /* FIX: use opacity transition without will-change to avoid GPU layer conflict */
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.55s ease',
        /* FIX: pointer-events none once fading so it doesn't block clicks */
        pointerEvents: fading ? 'none' : 'auto',
      }}
    >
      {/* Ambient glow — no will-change */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          background:
            'radial-gradient(ellipse 60% 55% at 50% 45%,rgba(45,142,255,0.10) 0%,transparent 65%)',
        }}
      />

      {/* Logo mark */}
      <div
        aria-hidden="true"
        style={{
          width: 80,
          height: 80,
          borderRadius: 22,
          background: 'linear-gradient(145deg,var(--blue-600),var(--accent))',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow:
            '0 0 0 1px rgba(45,142,255,0.25),0 0 60px rgba(45,142,255,0.3),var(--sh-lg)',
        }}
      >
        <span
          style={{ fontSize: 24, fontWeight: 800, color: '#fff', letterSpacing: -0.5 }}
        >
          RB
        </span>
      </div>

      {/* Headline */}
      <div style={{ textAlign: 'center' }}>
        <h1
          style={{
            fontSize: 'clamp(24px,4vw,38px)',
            fontWeight: 800,
            color: 'var(--text-primary)',
            letterSpacing: -1,
            lineHeight: 1.1,
          }}
        >
          Rony{' '}
          <span style={{ color: 'var(--accent-light)' }}>Brothers</span>
        </h1>
        <p
          style={{
            fontFamily: "'JetBrains Mono',monospace",
            fontSize: 10,
            color: 'var(--text-muted)',
            letterSpacing: 2.5,
            textTransform: 'uppercase',
            marginTop: 8,
          }}
        >
          Portal Resmi · v2.4.1
        </p>
      </div>

      {/* Enter button */}
      <button
        onClick={e => {
          e.stopPropagation();
          handleEnter();
        }}
        aria-label="Masuk ke portal"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(45,142,255,0.10)',
          border: '1px solid rgba(45,142,255,0.25)',
          borderRadius: 50,
          padding: '13px 30px',
          fontFamily: "'Plus Jakarta Sans',sans-serif",
          fontSize: 14,
          fontWeight: 600,
          color: 'var(--accent-light)',
          cursor: 'pointer',
          transition: 'background 0.2s, border-color 0.2s, transform 0.2s',
        }}
      >
        <svg
          viewBox="0 0 18 18"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
          style={{ width: 18, height: 18, opacity: 0.8, flexShrink: 0 }}
        >
          <path d="M3.5 9h11M9.5 4l5 5-5 5" />
        </svg>
        Masuk ke Portal
      </button>
    </div>
  );
};

// ── Main App Content ──────────────────────────────────────────────────────────
const AppContent: React.FC = () => {
  const { showToast } = useToast();
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashDone = () => {
    setShowSplash(false);
    // Stagger toasts after splash gone
    showToast('[OK] Portal aktif — selamat datang', 'ok', 200);
    showToast('[INFO] Memuat modul portal…', 'info', 1600);
    showToast('[OK] Enkripsi AES-256 aktif', 'ok', 3000);
  };

  return (
    <>
      {/* Render splash on top — unmount after fade completes */}
      {showSplash && <Splash onEnter={handleSplashDone} />}
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

// ── Root ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </ErrorBoundary>
  );
}
