import React from 'react'
import { Sidebar } from './components/Sidebar'
import { DashboardPage } from './pages/DashboardPage'

const App: React.FC = () => {
  return (
    <div
      className="grid-bg"
      style={{
        display: 'flex',
        height: '100vh',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <Sidebar />
      <DashboardPage />
    </div>
  )
}

export default App
