import React, { useMemo } from 'react'
import { useDashboardStore } from '../hooks/useStore'
import { Avatar } from '../components/Avatar'

export const Sidebar: React.FC = () => {
  const { mode, activeId, search, networks, setMode, setActiveId, setSearch } =
    useDashboardStore()

  const filtered = useMemo(
    () => networks.filter((n) => n.title.toLowerCase().includes(search.toLowerCase())),
    [networks, search]
  )

  return (
    <aside
      style={{
        width: 220,
        background: 'rgba(6,9,20,0.98)',
        borderRight: '1px solid rgba(255,255,255,0.05)',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 16px 14px',
          borderBottom: '1px solid rgba(255,255,255,0.05)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: 'linear-gradient(135deg,#4d88ff,#1a3db5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 17,
              boxShadow: '0 4px 16px #4d88ff44',
            }}
          >
            <img src="/logo.png" alt="logo" style={{ width: 32, height: 32, borderRadius: 9, objectFit: 'contain' }} />
          </div>
          <div>
            <div
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: '#f8fafc',
                letterSpacing: '-0.01em',
              }}
            >
              RydOne Public RPC
            </div>
            {/* <div
              style={{
                fontSize: 10,
                color: '#4d88ff',
                fontWeight: 600,
                letterSpacing: '0.12em',
              }}
            >
              RPC GATEWAY
            </div> */}
          </div>
        </div>
      </div>

      {/* Mode Toggle */}
      <div style={{ padding: '12px 10px 8px' }}>
        <div
          style={{
            display: 'flex',
            background: 'rgba(255,255,255,0.035)',
            borderRadius: 9,
            padding: 3,
            border: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          {(['mainnet', 'testnet'] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                flex: 1,
                padding: '6px 0',
                borderRadius: 6,
                border: 'none',
                background:
                  mode === m
                    ? 'linear-gradient(135deg,rgba(77,136,255,0.25),rgba(26,61,181,0.2))'
                    : 'transparent',
                color: mode === m ? '#7aadff' : '#475569',
                fontSize: 11,
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
                outline: mode === m ? '1px solid rgba(77,136,255,0.25)' : 'none',
              }}
            >
              {m === 'mainnet' ? (mode === 'mainnet' ? '● Mainnet' : '○ Mainnet') : mode === 'testnet' ? '◌ Testnet' : '◌ Testnet'}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '4px 10px 10px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 7,
            background: 'rgba(255,255,255,0.035)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 8,
            padding: '7px 10px',
          }}
        >
          <span style={{ color: '#334155', fontSize: 14 }}>🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search networks..."
            style={{
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#e2e8f0',
              fontSize: 12,
              width: '100%',
              fontFamily: 'inherit',
            }}
          />
        </div>
      </div>

      {/* Network List */}
      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '0 8px 12px',
        }}
      >
        {filtered.length === 0 && (
          <div
            style={{
              textAlign: 'center',
              padding: 20,
              color: '#334155',
              fontSize: 12,
            }}
          >
            No networks found
          </div>
        )}

        {filtered.map((n) => {
          const active = activeId === n.id
          return (
            <button
              key={n.id}
              onClick={() => setActiveId(n.id)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 9,
                padding: '8px 9px',
                borderRadius: 9,
                border: 'none',
                background: active ? `${n.color}18` : 'transparent',
                cursor: 'pointer',
                textAlign: 'left',
                borderLeft: active ? `2.5px solid ${n.color}` : '2.5px solid transparent',
                transition: 'all 0.15s',
                fontFamily: 'inherit',
                marginBottom: 2,
              }}
              onMouseEnter={(e) => {
                if (!active)
                  (e.currentTarget as HTMLButtonElement).style.background =
                    'rgba(255,255,255,0.04)'
              }}
              onMouseLeave={(e) => {
                if (!active)
                  (e.currentTarget as HTMLButtonElement).style.background = 'transparent'
              }}
            >
              <Avatar net={n} size={28} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: active ? 700 : 400,
                    color: active ? '#f8fafc' : '#94a3b8',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {n.title}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: '#334155',
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  {n.symbol}
                </div>
              </div>
              {active && (
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: n.color,
                    flexShrink: 0,
                    boxShadow: `0 0 7px ${n.color}`,
                  }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: '10px 16px',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          fontSize: 10,
          color: '#1e293b',
          letterSpacing: '0.08em',
        }}
      >
        PROVEWITHRYD.XYZ
      </div>
    </aside>
  )
}
