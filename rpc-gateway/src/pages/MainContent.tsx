import React from 'react'
import { useDashboardStore } from '../hooks/useStore'
import { useNodeStats } from '../hooks/useNodeStats'
import { useLatency } from '../hooks/useLatency'
import { useLiveRps } from '../hooks/useLiveRps'
import { Avatar } from '../components/Avatar'
import { EndpointCard } from '../components/EndpointCard'
import { CopyPeers } from '../components/CopyPeers'
import { StakeBanner } from '../components/StakeBanner'
import { RequestChart } from '../components/RequestChart'

interface StatCardProps {
  label: string
  value: string
  live?: boolean
  highlight?: boolean
}

const StatCard: React.FC<StatCardProps> = ({ label, value, live, highlight }) => (
  <div style={{
    background: 'rgba(255,255,255,0.025)',
    border: `1px solid ${highlight ? 'rgba(77,136,255,0.3)' : 'rgba(255,255,255,0.06)'}`,
    borderRadius: 12, padding: '14px 16px', transition: 'all 0.2s',
  }}>
    <div style={{
      fontSize: 10, fontWeight: 600, color: '#4a5568',
      textTransform: 'uppercase', letterSpacing: '0.07em',
      marginBottom: 6, display: 'flex', alignItems: 'center', gap: 5,
    }}>
      {live && <span style={{
        width: 5, height: 5, borderRadius: '50%', background: '#22c55e',
        display: 'inline-block', boxShadow: '0 0 5px #22c55e',
        animation: 'pulse 2s infinite', flexShrink: 0,
      }} />}
      {label}
    </div>
    <div style={{
      fontSize: 18, fontWeight: 700,
      color: highlight ? '#7aadff' : '#f1f5f9',
      fontFamily: "'Space Mono', monospace", lineHeight: 1,
    }}>
      {value}
    </div>
  </div>
)

function fmtNum(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return String(Math.round(n))
}

export const MainContent: React.FC = () => {
  const { activeNetwork: net } = useDashboardStore()
  const { stats, status } = useNodeStats(net.statsApi ?? null, net.chainId)
  const latency = useLatency(net)
  const liveRps = useLiveRps(stats?.curRps ?? 0)

  const isLive = !!net.statsApi && status === 'ok' && !!stats

  const statTotal     = isLive ? fmtNum(stats!.totalRequests)       : net.stats.total
  const statCached    = isLive ? stats!.cachedPct.toFixed(1) + '%'  : net.stats.cached !== '—' ? net.stats.cached + '%' : '—'
  const statAvgRps    = isLive ? fmtNum(stats!.avgRps)              : net.stats.avgRps
  const statCurRps    = isLive ? fmtNum(liveRps)                    : net.stats.curRps
  const statBlockTime = isLive ? stats!.blockTime.toFixed(2) + 's'  : net.stats.blockTime

  const latMs = latency.ms
  const isOnline = isLive ? !stats?.syncing : latency.status !== 'offline'

  const latLabel = latency.status === 'offline' ? 'Offline'
    : latency.status === 'measuring' || latency.status === 'idle' ? 'Pinging…'
    : latMs !== null ? `~${latMs}ms` : '— ms'
  const latColor = latency.status === 'offline' ? '#ef4444'
    : latMs === null ? '#64748b'
    : latMs < 100 ? '#22c55e' : latMs < 300 ? '#f59e0b' : '#ef4444'

  return (
    <main style={{ flex: 1, padding: '24px 20px', zIndex: 1 }}>
      <style>{`
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @media (max-width: 768px) {
          .main-header-title { font-size: 22px !important; }
          .main-padding { padding: 16px 14px !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>

      {/* Header */}
      <div className="main-padding" style={{ marginBottom: 20, padding: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12, flexWrap: 'wrap' }}>
          <Avatar net={net} size={44} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <h1
              className="main-header-title"
              style={{
                fontSize: 26, fontWeight: 800, margin: 0, lineHeight: 1.2,
                color: '#f8fafc', letterSpacing: '-0.02em',
              }}
            >
              RPC Gateway to{' '}
              <span style={{ color: net.color }}>{net.title}</span>
            </h1>
            <p style={{ margin: '4px 0 0', color: '#475569', fontSize: 13 }}>
              Fast, free, and privacy-first RPC endpoint
            </p>
          </div>
        </div>

        {/* Status badges — scroll horizontally on mobile */}
        <div style={{
          display: 'flex', gap: 7, flexWrap: 'wrap', alignItems: 'center',
          overflowX: 'auto', WebkitOverflowScrolling: 'touch',
          paddingBottom: 2,
        }}>
          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, flexShrink: 0,
            background: isOnline ? 'rgba(34,197,94,0.08)' : 'rgba(239,68,68,0.08)',
            border: `1px solid ${isOnline ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}`,
            borderRadius: 20, padding: '4px 12px', fontSize: 12,
            color: isOnline ? '#22c55e' : '#ef4444', fontWeight: 600,
          }}>
            <span style={{
              width: 6, height: 6, borderRadius: '50%',
              background: isOnline ? '#22c55e' : '#ef4444', display: 'inline-block',
              boxShadow: isOnline ? '0 0 6px #22c55e' : 'none',
              animation: isOnline ? 'pulse 2.5s infinite' : 'none',
            }} />
            {isOnline ? 'Online' : 'Offline'}
          </span>

          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
            background: 'rgba(77,136,255,0.08)', border: '1px solid rgba(77,136,255,0.18)',
            borderRadius: 20, padding: '4px 12px', fontSize: 12, color: latColor, fontWeight: 600,
          }}>
            ⚡ {latLabel}
          </span>

          <span style={{
            display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#64748b', fontWeight: 600,
          }}>
            Block: {statBlockTime}
          </span>

          {isLive && (
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: 5, flexShrink: 0,
              background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.2)',
              borderRadius: 20, padding: '4px 12px', fontSize: 11, color: '#4ade80', fontWeight: 600,
            }}>
              ● LIVE · block #{stats!.latestBlockHeight.toLocaleString()}
            </span>
          )}
        </div>
      </div>

      {/* Endpoint Card */}
      <EndpointCard net={net} />

      {/* Stake Banner */}
      <CopyPeers net={net} />
      <StakeBanner net={net} />

      {/* Stats Grid */}
      <div
        className="stats-grid"
        style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, marginBottom: 12 }}
      >
        <StatCard label="Total Requests"   value={statTotal}     live={isLive} />
        <StatCard label="Cached Requests"  value={statCached}    live={isLive} />
        <StatCard label="Avg req/sec"      value={statAvgRps} />
        <StatCard label="Current req/sec"  value={statCurRps}    highlight live />
        <StatCard label="Avg Block Time"   value={statBlockTime} live={isLive} />
      </div>

      {/* Extra live row */}
      {isLive && stats && (
        <div
          className="stats-grid"
          style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: 8, marginBottom: 12 }}
        >
          <StatCard label="Peers"      value={String(stats.numPeers)}              live />
          <StatCard label="Memory"     value={stats.memUsageMB.toFixed(0) + ' MB'} live />
          <StatCard label="Goroutines" value={String(stats.goRoutines)}             live />
          {stats.evmBlockNumber !== undefined && (
            <StatCard label="EVM Block" value={fmtNum(stats.evmBlockNumber)} live />
          )}
        </div>
      )}

      <RequestChart />
      <div style={{ height: 24 }} />
    </main>
  )
}