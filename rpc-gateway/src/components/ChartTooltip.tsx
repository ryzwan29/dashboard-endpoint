import React from 'react'

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

function fmt(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(2) + 'M'
  if (n >= 1_000) return (n / 1_000).toFixed(1) + 'K'
  if (n >= 1_000)     return (n / 1_000).toFixed(1) + 'K'
  return String(Math.round(n))
}

export const ChartTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  return (
    <div style={{
      background: 'rgba(8,12,28,0.97)',
      border: '1px solid rgba(77,136,255,0.3)',
      borderRadius: 8, padding: '10px 14px', fontSize: 12,
    }}>
      <div style={{ color: '#64748b', marginBottom: 5 }}>{label}</div>
      <div style={{ color: '#4d88ff', marginBottom: 3 }}>
        Total: {fmt(payload[0]?.value ?? 0)}
      </div>
      <div style={{ color: '#22d3ee' }}>
        Cached: {fmt(payload[1]?.value ?? 0)}
      </div>
    </div>
  )
}