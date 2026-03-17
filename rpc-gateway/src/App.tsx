import React from 'react'
import { Sidebar } from './pages/Sidebar'
import { MainContent } from './pages/MainContent'
import { Footer } from './components/Footer'
import { mainnetNetworks, testnetNetworks } from './data'

function App() {
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

      {/* Sidebar + Content row */}
      <div style={{ display: 'flex', flex: 1, minHeight: 0, zIndex: 1 }}>
        <Sidebar />
        <MainContent />
      </div>

      {/* Footer */}
      <Footer
        mainnetCount={mainnetNetworks.length}
        testnetCount={testnetNetworks.length}
      />
    </div>
  )
}

export default App