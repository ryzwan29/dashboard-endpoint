import React from 'react'
import { Network } from '../data'
import { TabKey, useDashboardStore } from '../hooks/useStore'
import { CopyButton } from '../components/CopyButton'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'rpc',     label: 'RPC' },
  { key: 'wss',     label: 'WS RPC' },
  { key: 'grpc',    label: 'gRPC' },
  { key: 'grpcWeb', label: 'gRPC-Web' },
  { key: 'rest',    label: 'REST' },
  { key: 'evm',     label: 'EVM' },
]

interface Props {
  net: Network
}

export const EndpointCard: React.FC<Props> = ({ net }) => {
  const { tab, setTab } = useDashboardStore()
  const endpointVal = net[tab] as string

  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.07)',
      borderRadius: 16,
      marginBottom: 12,
      overflow: 'hidden',
    }}>
      {/* Tabs — horizontally scrollable on mobile */}
      <div style={{
        display: 'flex',
        gap: 0,
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        scrollbarWidth: 'none',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        padding: '10px 12px 0',
      }}>
        <style>{`.endpoint-tabs::-webkit-scrollbar{display:none}`}</style>
        {TABS.map(({ key, label }) => {
          const val = net[key] as string
          const disabled = !val || val === '#'
          const active = tab === key
          return (
            <button
              key={key}
              onClick={() => !disabled && setTab(key)}
              style={{
                padding: '7px 14px',
                borderRadius: '8px 8px 0 0',
                border: 'none',
                borderBottom: active ? `2px solid ${net.color}` : '2px solid transparent',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.3 : 1,
                background: active ? `${net.color}15` : 'transparent',
                color: active ? net.color : '#64748b',
                fontSize: 12,
                fontWeight: active ? 700 : 500,
                transition: 'all 0.15s',
                fontFamily: 'inherit',
                whiteSpace: 'nowrap',
                flexShrink: 0,
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* URL Row */}
      <div style={{ padding: '12px 14px' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 10,
          padding: '11px 14px',
          minWidth: 0,
        }}>
          <code style={{
            flex: 1,
            fontFamily: "'Space Mono', monospace",
            fontSize: 12,
            color: endpointVal && endpointVal !== '#' ? '#7dd3fc' : '#334155',
            wordBreak: 'break-all',
            minWidth: 0,
          }}>
            {endpointVal && endpointVal !== '#'
              ? endpointVal
              : '— Not available for this network —'}
          </code>
          <div style={{ flexShrink: 0 }}>
            <CopyButton value={endpointVal} />
          </div>
        </div>
      </div>
    </div>
  )
}