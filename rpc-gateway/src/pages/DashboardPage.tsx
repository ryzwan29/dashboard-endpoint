import React from 'react'
import { useGatewayStore } from '../hooks/useGatewayStore'
import { useLatency } from '../hooks/useLatency'
import { EndpointCard } from '../components/EndpointCard'
import { StatsGrid } from '../components/StatsGrid'
import { RequestChart } from '../components/RequestChart'
import { LatencyBadge } from '../components/LatencyBadge'

export const DashboardPage: React.FC = () => {
  const { activeNetwork, timeRange, setTimeRange } = useGatewayStore()
  const latency = useLatency(activeNetwork)

  const statusColors: Record<string, string> = {
    online: '#22c55e',
    degraded: '#f59e0b',
    offline: '#ef4444',
  }

  const liveStatus =
    latency.status === 'offline'
      ? 'offline'
      : latency.status === 'degraded'
      ? 'degraded'
      : latency.status === 'online' || latency.status === 'measuring'
      ? 'online'
      : activeNetwork.status

  const statusColor = statusColors[liveStatus]

  const badge = (bg: string, color: string, border: string, children: React.ReactNode) => (
    <span
      style={{
        padding: '3px 10px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 500,
        fontFamily: 'var(--mono)',
        background: bg,
        color,
        border: `1px solid ${border}`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
      }}
    >
      {children}
    </span>
  )

  return (
    <main
      className="fade-in"
      style={{ flex: 1, overflowY: 'auto', padding: '32px 36px', position: 'relative' }}
    >
      <div style={{ marginBottom: 28 }}>
        <h1
          style={{
            fontSize: 32,
            fontWeight: 700,
            letterSpacing: '-.5px',
            background: 'linear-gradient(135deg,#e2e8f0 0%,#94a3b8 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 6,
          }}
        >
          RPC Gateway to {activeNetwork.title}
        </h1>
        <p style={{ fontSize: 14, color: 'var(--text2)' }}>
          Fast, free, and reliable public RPC endpoints — no API key required
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 10, flexWrap: 'wrap' }}>
          {badge(
            liveStatus === 'offline' ? 'rgba(239,68,68,.1)' : liveStatus === 'degraded' ? 'rgba(245,158,11,.1)' : 'rgba(34,197,94,.1)',
            statusColor,
            liveStatus === 'offline' ? 'rgba(239,68,68,.3)' : liveStatus === 'degraded' ? 'rgba(245,158,11,.3)' : 'rgba(34,197,94,.3)',
            <>
              <span className="pulse-dot" style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: statusColor }} />
              {liveStatus.charAt(0).toUpperCase() + liveStatus.slice(1)}
            </>
          )}
          {badge('rgba(59,125,232,.1)', 'var(--accent2)', 'rgba(59,125,232,.3)', `Chain ID: ${activeNetwork.chainId}`)}
          <LatencyBadge result={latency} />
          {latency.lastChecked && (
            <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
              checked {latency.lastChecked.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
      <EndpointCard />
      <StatsGrid network={activeNetwork} timeRange={timeRange} onTimeRangeChange={setTimeRange} />
      <RequestChart network={activeNetwork} timeRange={timeRange} />
    </main>
  )
}
