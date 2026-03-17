import React from 'react'

interface TooltipProps {
  active?: boolean
  payload?: Array<{ value: number }>
  label?: string
}

export const ChartTooltip: React.FC<TooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null

  return (
    <div
      style={{
        background: 'rgba(8,12,28,0.97)',
        border: '1px solid rgba(77,136,255,0.3)',
        borderRadius: 8,
        padding: '10px 14px',
        fontSize: 12,
      }}
    >
      <div style={{ color: '#64748b', marginBottom: 5 }}>{label}</div>
      <div style={{ color: '#4d88ff', marginBottom: 3 }}>
        Total: {(payload[0]?.value / 1e6).toFixed(2)}M
      </div>
      <div style={{ color: '#22d3ee' }}>
        Cached: {(payload[1]?.value / 1e6).toFixed(2)}M
      </div>
    </div>
  )
}
