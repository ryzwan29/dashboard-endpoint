import React from 'react'
import { useCopy } from '../hooks/useCopy'

interface CopyButtonProps {
  value: string
}

export const CopyButton: React.FC<CopyButtonProps> = ({ value }) => {
  const disabled = !value || value === '#'
  const { copied, copy } = useCopy()

  return (
    <button
      onClick={() => !disabled && copy(value)}
      disabled={disabled}
      style={{
        padding: '9px 18px',
        borderRadius: 8,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.35 : 1,
        background: copied
          ? 'linear-gradient(135deg,#22c55e,#16a34a)'
          : 'linear-gradient(135deg,#4d88ff,#1a56db)',
        color: '#fff',
        fontSize: 13,
        fontWeight: 700,
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        fontFamily: "'Syne', sans-serif",
        boxShadow: copied ? '0 4px 14px #22c55e44' : '0 4px 14px #4d88ff33',
      }}
    >
      {copied ? '✓  Copied!' : '⎘  Copy'}
    </button>
  )
}
