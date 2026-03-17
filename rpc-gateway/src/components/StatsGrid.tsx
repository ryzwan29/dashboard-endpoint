import React from 'react'
import { Network, TimeRange } from '../data'
import { useLiveRps } from '../hooks/useLiveRps'
import { useNodeStats } from '../hooks/useNodeStats'

function fmtNum(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(2) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return String(Math.round(n))
}

interface StatCardProps {
  label: string
  value: string
  sub?: string
  highlight?: boolean
  live?: boolean
}

const StatCard: React.FC<StatCardProps> = ({ label, value, sub, highlight, live }) => (
  <div
    style={{
      background: 'var(--bg2)',
      border: `1px solid ${highlight ? 'var(--accent)' : 'var(--border)'}`,
      borderRadius: 12,
      padding: 16,
      transition: 'border-color .2s',
    }}
  >
    <div
      style={{
        fontSize: 11,
        color: 'var(--text3)',
        fontFamily: 'var(--mono)',
        letterSpacing: '.5px',
        textTransform: 'uppercase',
        marginBottom: 8,
        display: 'flex',
        alignItems: 'center',
        gap: 5,
      }}
    >
      {live && (
        <span
          style={{
            width: 5, height: 5, borderRadius: '50%',
            background: '#22c55e', display: 'inline-block',
            animation: 'pulse-dot 2s infinite', flexShrink: 0,
          }}
        />
      )}
      {label}
    </div>
    <div style={{ fontSize: 20, fontWeight: 600, fontFamily: 'var(--mono)', color: highlight ? 'var(--accent2)' : 'var(--text)' }}>
      {value}
    </div>
    {sub && <div style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)', marginTop: 3 }}>{sub}</div>}
  </div>
)

interface Props {
  network: Network
  timeRange: TimeRange
  onTimeRangeChange: (r: TimeRange) => void
}

export const StatsGrid: React.FC<Props> = ({ network, timeRange, onTimeRangeChange }) => {
  const { stats, status, lastUpdated } = useNodeStats(network.statsApi ?? null, network.chainId)
  const mockLiveRps = useLiveRps(network)

  const isLive = !!network.statsApi && status === 'ok' && !!stats
  const mul = timeRange === '24h' ? 1 : timeRange === '7d' ? 7 : 30

  const totalReqs = isLive ? stats!.totalRequests : Math.round(network.totalReqs * mul)
  const cachedPct = isLive ? stats!.cachedPct : network.cachedPct
  const avgRps    = isLive ? stats!.avgRps : network.avgRps
  const curRps    = isLive ? stats!.curRps : mockLiveRps
  const blockTime = isLive ? stats!.blockTime : network.blockTime

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 16, fontWeight: 600 }}>Network Stats</span>
          {isLive && (
            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: '#4ade80', background: 'rgba(34,197,94,.08)', border: '1px solid rgba(34,197,94,.2)', borderRadius: 20, padding: '2px 8px' }}>
              ● LIVE
            </span>
          )}
          {network.statsApi && status === 'error' && (
            <span style={{ fontSize: 10, fontFamily: 'var(--mono)', color: '#f87171', background: 'rgba(239,68,68,.08)', border: '1px solid rgba(239,68,68,.2)', borderRadius: 20, padding: '2px 8px' }}>
              ● API Error — showing mock data
            </span>
          )}
        </div>
        {!isLive && (
          <div style={{ display: 'flex', gap: 4 }}>
            {(['24h', '7d', '30d'] as TimeRange[]).map((r) => (
              <button key={r} onClick={() => onTimeRangeChange(r)}
                style={{
                  padding: '5px 14px', borderRadius: 6,
                  border: `1px solid ${timeRange === r ? 'var(--accent)' : 'var(--border2)'}`,
                  background: timeRange === r ? 'var(--accent)' : 'transparent',
                  color: timeRange === r ? '#fff' : 'var(--text2)',
                  fontSize: 12, fontFamily: 'var(--mono)', cursor: 'pointer', transition: 'all .2s',
                }}
              >{r}</button>
            ))}
          </div>
        )}
        {isLive && lastUpdated && (
          <span style={{ fontSize: 10, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
            updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 20 }}>
        <StatCard label="Total Requests" value={fmtNum(totalReqs)} sub={isLive ? `block #${stats?.latestBlockHeight.toLocaleString()}` : `last ${timeRange}`} live={isLive} />
        <StatCard label="Cached Requests" value={cachedPct.toFixed(1) + '%'} sub="cache hit rate" live={isLive} />
        <StatCard label="Avg req/sec" value={fmtNum(avgRps)} sub="rolling average" />
        <StatCard label="Current req/sec" value={fmtNum(curRps)} sub="live" highlight live />
        <StatCard label="Avg Block Time" value={blockTime.toFixed(2) + ' s'} sub={isLive && stats?.syncing ? '⚠ syncing' : 'seconds'} />
      </div>

      {isLive && stats && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
          <StatCard label="Peers" value={String(stats.numPeers)} sub="connected peers" />
          <StatCard label="Memory" value={stats.memUsageMB.toFixed(0) + ' MB'} sub="heap alloc" />
          <StatCard label="Goroutines" value={String(stats.goRoutines)} sub="active goroutines" />
        </div>
      )}
    </div>
  )
}
