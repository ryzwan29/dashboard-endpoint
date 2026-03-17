import React, { useState } from 'react'
import { Sidebar } from './pages/Sidebar'
import { MainContent } from './pages/MainContent'
import { Footer } from './components/Footer'
import { mainnetNetworks, testnetNetworks } from './data'

function App() {
  const [drawerOpen, setDrawerOpen] = useState(false)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: '#05080f',
      fontFamily: "'Syne', sans-serif",
      position: 'relative',
    }}>
      {/* Grid overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backgroundImage:
          'linear-gradient(rgba(77,136,255,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(77,136,255,0.04) 1px,transparent 1px)',
        backgroundSize: '52px 52px', zIndex: 0,
      }} />

      {/* ── Mobile top bar ── */}
      <div className="mobile-topbar" style={{
        display: 'none',
        alignItems: 'center',
        gap: 10,
        padding: '0 16px',
        height: 52,
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        background: 'rgba(6,9,20,0.98)',
        position: 'sticky', top: 0, zIndex: 100,
        flexShrink: 0,
      }}>
        {/* Hamburger */}
        <button
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          style={{
            width: 32, height: 32, borderRadius: 8, flexShrink: 0,
            border: '1px solid rgba(255,255,255,0.1)',
            background: 'rgba(255,255,255,0.04)',
            cursor: 'pointer', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center', gap: 5,
            padding: 0,
          }}
        >
          <span style={{ width: 14, height: 2, background: '#94a3b8', borderRadius: 2, display: 'block' }} />
          <span style={{ width: 14, height: 2, background: '#94a3b8', borderRadius: 2, display: 'block' }} />
          <span style={{ width: 14, height: 2, background: '#94a3b8', borderRadius: 2, display: 'block' }} />
        </button>

        {/* Logo + title — vertically centered as a group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
          <img src="/logo.png" alt="logo"
            style={{ width: 28, height: 28, borderRadius: 7, objectFit: 'contain', display: 'block' }}
            onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
          />
          <span style={{ fontSize: 15, fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.01em', lineHeight: 1 }}>
            RydOne Public Endpoints
          </span>
        </div>
      </div>

      {/* ── Sidebar + Content row ── */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, zIndex: 1, position: 'relative', overflow: 'hidden' }}>

        {/* Backdrop */}
        {drawerOpen && (
          <div
            onClick={() => setDrawerOpen(false)}
            style={{
              position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)',
              zIndex: 49, backdropFilter: 'blur(2px)',
            }}
          />
        )}

        {/* Sidebar — desktop: static, mobile: drawer */}
        <div className={`sidebar-wrapper${drawerOpen ? ' drawer-open' : ''}`}>
          <Sidebar onClose={() => setDrawerOpen(false)} />
        </div>

        {/* Main scroll area */}
        <div style={{ flex: 1, overflowY: 'auto', minWidth: 0, display: 'flex', flexDirection: 'column' }}>
          <MainContent />
          <Footer
            mainnetCount={mainnetNetworks.length}
            testnetCount={testnetNetworks.length}
          />
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .mobile-topbar { display: flex !important; }
          .sidebar-wrapper {
            position: fixed !important;
            top: 0; left: 0; bottom: 0;
            width: 280px !important;
            z-index: 50;
            transform: translateX(-100%);
            transition: transform 0.26s cubic-bezier(0.4,0,0.2,1);
          }
          .sidebar-wrapper.drawer-open {
            transform: translateX(0) !important;
          }
        }
        @media (min-width: 769px) {
          .sidebar-wrapper {
            position: relative;
            transform: none !important;
            flex-shrink: 0;
          }
        }
        * { -webkit-tap-highlight-color: transparent; box-sizing: border-box; }
      `}</style>
    </div>
  )
}

export default App