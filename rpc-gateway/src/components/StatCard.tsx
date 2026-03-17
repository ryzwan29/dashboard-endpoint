import React, { useState } from 'react'

interface StatCardProps {
  label: string
  value: string
}

export const StatCard: React.FC<StatCardProps> = ({ label, value }) => {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'rgba(255,255,255,0.025)',
        border: `1px solid ${hovered ? 'rgba(77,136,255,0.25)' : 'rgba(255,255,255,0.06)'}`,
        borderRadius: 12,
        padding: '18px 20px',
        transition: 'all 0.2s',
        cursor: 'default',
      }}
    >
      <div
        style={{
          fontSize: 11,
          fontWeight: 600,
          color: '#4a5568',
          textTransform: 'uppercase',
          letterSpacing: '0.07em',
          marginBottom: 8,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 22,
          fontWeight: 700,
          color: '#f1f5f9',
          fontFamily: "'Space Mono', monospace",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
    </div>
  )
}
