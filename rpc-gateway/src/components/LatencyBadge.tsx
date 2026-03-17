import React from 'react'
import { LatencyResult } from '../hooks/useLatency'

interface Props {
  result: LatencyResult
}

// Tiny inline sparkline using SVG — shows last N latency measurements
const Sparkline: React.FC<{ data: number[] }> = ({ data }) => {
  if (data.length < 2) return null

  const w = 48
  const h = 16
  const min = Math.min(...data)
  const max = Math.max(...data, min + 1)
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * w
    const y = h - ((v - min) / (max - min)) * (h - 2) - 1
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ opacity: 0.7 }}>
      <polyline
        points={pts.join(' ')}
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export const LatencyBadge: React.FC<Props> = ({ result }) => {
  const { ms, status, history } = result

  const isMeasuring = status === 'measuring' || status === 'idle'

  const style =
    status === 'offline'
      ? { bg: 'rgba(239,68,68,.08)', color: '#f87171', border: 'rgba(239,68,68,.2)' }
      : ms === null || isMeasuring
      ? { bg: 'rgba(148,163,184,.08)', color: '#94a3b8', border: 'rgba(148,163,184,.2)' }
      : ms < 100
      ? { bg: 'rgba(34,197,94,.08)',   color: '#4ade80', border: 'rgba(34,197,94,.2)'  }
      : ms < 300
      ? { bg: 'rgba(245,158,11,.08)',  color: '#fbbf24', border: 'rgba(245,158,11,.2)' }
      : { bg: 'rgba(239,68,68,.08)',   color: '#f87171', border: 'rgba(239,68,68,.2)'  }

  const label =
    status === 'offline'
      ? 'Offline'
      : isMeasuring && ms === null
      ? 'Pinging…'
      : ms !== null
      ? `${ms} ms`
      : '— ms'

  return (
    <span
      title={
        status === 'offline'
          ? 'Endpoint unreachable'
          : ms !== null
          ? `Latency: ${ms}ms (live ping)`
          : 'Measuring latency…'
      }
      style={{
        padding: '3px 10px 3px 8px',
        borderRadius: 20,
        fontSize: 11,
        fontWeight: 500,
        fontFamily: 'var(--mono)',
        background: style.bg,
        color: style.color,
        border: `1px solid ${style.border}`,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 6,
        cursor: 'default',
        transition: 'background .3s, color .3s',
      }}
    >
      {/* Pulse dot */}
      <span
        style={{
          display: 'inline-block',
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: style.color,
          animation: isMeasuring ? 'pulse-dot 1s infinite' : status === 'online' || status === 'degraded' ? 'pulse-dot 2.5s infinite' : 'none',
          flexShrink: 0,
        }}
      />

      {label}

      {/* Sparkline if we have history */}
      {history.length >= 3 && status !== 'offline' && (
        <span style={{ color: style.color }}>
          <Sparkline data={history} />
        </span>
      )}
    </span>
  )
}
