import React, { useState } from 'react'
import { useGatewayStore } from '../hooks/useGatewayStore'
import { Network } from '../data'

const StatusDot: React.FC<{ status: Network['status'] }> = ({ status }) => {
  const colors = {
    online: '#22c55e',
    degraded: '#f59e0b',
    offline: '#ef4444',
  }
  return (
    <span
      className="pulse-dot"
      style={{
        display: 'inline-block',
        width: 6,
        height: 6,
        borderRadius: '50%',
        background: colors[status],
        flexShrink: 0,
      }}
    />
  )
}

export const Sidebar: React.FC = () => {
  const { activeNetwork, netType, searchQuery, selectNetwork, setNetType, setSearchQuery, getFilteredNetworks } =
    useGatewayStore()
  const networks = getFilteredNetworks()

  return (
    <aside
      style={{
        width: 220,
        minWidth: 220,
        background: 'var(--bg2)',
        borderRight: '1px solid var(--border)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        zIndex: 10,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: '20px 16px 14px',
          borderBottom: '1px solid var(--border)',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: 'linear-gradient(135deg,#3b7de8,#1e40af)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--mono)',
            fontSize: 11,
            fontWeight: 700,
            color: '#fff',
          }}
        >
          RPC
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, letterSpacing: '.5px' }}>PublicNode</div>
          <div style={{ fontSize: 10, color: 'var(--text3)', letterSpacing: 1, textTransform: 'uppercase' }}>
            RPC Gateway
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ position: 'relative' }}>
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2.5"
            style={{ position: 'absolute', left: 8, top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search networks..."
            style={{
              width: '100%',
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: '7px 10px 7px 30px',
              fontSize: 12,
              color: 'var(--text)',
              fontFamily: 'var(--mono)',
              outline: 'none',
            }}
          />
        </div>
      </div>

      {/* Mainnet / Testnet toggle */}
      <div
        style={{
          display: 'flex',
          padding: '10px 12px',
          gap: 6,
          borderBottom: '1px solid var(--border)',
        }}
      >
        {(['mainnet', 'testnet'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setNetType(t)}
            style={{
              flex: 1,
              padding: '5px 0',
              borderRadius: 6,
              border: `1px solid ${netType === t ? 'var(--accent)' : 'var(--border2)'}`,
              background: netType === t ? 'var(--accent)' : 'transparent',
              color: netType === t ? '#fff' : 'var(--text2)',
              fontSize: 11,
              fontFamily: 'var(--sans)',
              cursor: 'pointer',
              fontWeight: 500,
              letterSpacing: '.3px',
              transition: 'all .2s',
              textTransform: 'capitalize',
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Network list */}
      <div style={{ flex: 1, overflowY: 'auto' }}>
        {networks.length === 0 ? (
          <div
            style={{
              padding: 20,
              textAlign: 'center',
              fontSize: 12,
              color: 'var(--text3)',
              fontFamily: 'var(--mono)',
            }}
          >
            No networks found
          </div>
        ) : (
          networks.map((n) => (
            <div
              key={n.id}
              onClick={() => selectNetwork(n.id)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 10,
                padding: '9px 14px',
                cursor: 'pointer',
                transition: 'all .15s',
                borderLeft: `2px solid ${n.id === activeNetwork.id ? 'var(--accent)' : 'transparent'}`,
                background: n.id === activeNetwork.id ? 'var(--accent-glow)' : 'transparent',
              }}
              onMouseEnter={(e) => {
                if (n.id !== activeNetwork.id)
                  (e.currentTarget as HTMLDivElement).style.background = 'var(--surface)'
              }}
              onMouseLeave={(e) => {
                if (n.id !== activeNetwork.id)
                  (e.currentTarget as HTMLDivElement).style.background = 'transparent'
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  background: n.color + '22',
                  color: n.color,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 9,
                  fontWeight: 700,
                  fontFamily: 'var(--mono)',
                  flexShrink: 0,
                }}
              >
                {n.ticker.slice(0, 4)}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  flex: 1,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {n.title}
              </div>
              <StatusDot status={n.status} />
            </div>
          ))
        )}
      </div>
    </aside>
  )
}
