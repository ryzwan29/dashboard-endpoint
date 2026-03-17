import React, { useState } from 'react'
import { Network } from '../data'

interface AvatarProps {
  net: Network
  size?: number
}

export const Avatar: React.FC<AvatarProps> = ({ net, size = 30 }) => {
  const [imgError, setImgError] = useState(false)

  const letters = net.title
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const showImg = !!net.logo && !imgError

  return (
    <div
      style={{
        width: size, height: size, borderRadius: '50%', flexShrink: 0,
        background: showImg ? 'transparent' : `radial-gradient(circle at 38% 38%, ${net.color}dd, ${net.color}55)`,
        border: `1.5px solid ${net.color}55`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
        boxShadow: `0 0 ${size / 2}px ${net.color}22`,
      }}
    >
      {showImg ? (
        <img
          src={net.logo}
          alt={net.title}
          onError={() => setImgError(true)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
      ) : (
        <span style={{
          fontSize: size * 0.38, fontWeight: 700, color: '#fff',
          fontFamily: "'Space Mono', monospace",
        }}>
          {letters}
        </span>
      )}
    </div>
  )
}