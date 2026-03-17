import React, { useState } from 'react'
import { Network } from '../data'

interface Props {
  net: Network
}

export const StakeBanner: React.FC<Props> = ({ net }) => {
  const [imgError, setImgError] = useState(false)
  if (!net.stake) return null
  const showImg = !!net.logo && !imgError

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        background: 'linear-gradient(135deg, rgba(0,0,0,0.6) 0%, rgba(15,15,25,0.9) 100%)',
        border: `1px solid ${net.color}33`,
        borderRadius: 14,
        padding: '16px 20px',
        marginBottom: 16,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Glow accent */}
      <div style={{
        position: 'absolute', left: -40, top: -40,
        width: 120, height: 120, borderRadius: '50%',
        background: `radial-gradient(circle, ${net.color}22 0%, transparent 70%)`,
        pointerEvents: 'none',
      }} />

      {/* Left — avatar + text */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, zIndex: 1 }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%', flexShrink: 0,
          background: showImg ? 'transparent' : `radial-gradient(circle at 38% 38%, ${net.color}dd, ${net.color}44)`,
          border: `1.5px solid ${net.color}66`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          overflow: 'hidden',
          fontSize: 18, fontWeight: 700, color: '#fff',
          fontFamily: "'Space Mono', monospace",
          boxShadow: `0 0 18px ${net.color}33`,
        }}>
          {showImg
            ? <img src={net.logo} alt={net.title} onError={() => setImgError(true)} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : net.title.slice(0, 2).toUpperCase()
          }
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', marginBottom: 2 }}>
            Support {net.title} — Stake with us
          </div>
          <div style={{ fontSize: 12, color: '#475569' }}>
            Delegate to our validator and help secure the network
          </div>
        </div>
      </div>

      {/* Right — CTA button */}
      <a
        href={net.stake}
        target="_blank"
        rel="noreferrer"
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '9px 18px', borderRadius: 9, flexShrink: 0,
          background: '#fff', color: '#0f172a',
          fontSize: 13, fontWeight: 700,
          textDecoration: 'none', transition: 'all 0.2s',
          whiteSpace: 'nowrap', zIndex: 1,
          boxShadow: '0 2px 12px rgba(0,0,0,0.3)',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = net.color
          ;(e.currentTarget as HTMLAnchorElement).style.color = '#fff'
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.background = '#fff'
          ;(e.currentTarget as HTMLAnchorElement).style.color = '#0f172a'
        }}
      >
        Stake now →
      </a>
    </div>
  )
}