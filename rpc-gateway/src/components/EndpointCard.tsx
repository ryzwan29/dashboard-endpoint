import React from 'react'
import { Network } from '../data'
import { TabKey, useDashboardStore } from '../hooks/useStore'
import { CopyButton } from '../components/CopyButton'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'rpc', label: 'RPC' },
  { key: 'wss', label: 'WS RPC' },
  { key: 'grpc', label: 'gRPC' },
  { key: 'grpcWeb', label: 'gRPC-Web' },
  { key: 'rest', label: 'REST' },
  { key: 'evm', label: 'EVM' },
]

interface Props {
  net: Network
}

export const EndpointCard: React.FC<Props> = ({ net }) => {
  const { tab, setTab } = useDashboardStore()
  const endpointVal = net[tab] as string

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: 24,
        marginBottom: 16,
      }}
    >
      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          marginBottom: 20,
          flexWrap: 'wrap',
        }}
      >
        {TABS.map(({ key, label }) => {
          const val = net[key] as string
          const disabled = !val || val === '#'
          const active = tab === key
          return (
            <button
              key={key}
              onClick={() => !disabled && setTab(key)}
              style={{
                padding: '7px 15px',
                borderRadius: 8,
                border: active ? `1px solid ${net.color}44` : '1px solid transparent',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.3 : 1,
                background: active ? `${net.color}22` : 'rgba(255,255,255,0.04)',
                color: active ? net.color : '#64748b',
                fontSize: 13,
                fontWeight: active ? 700 : 500,
                transition: 'all 0.15s',
                fontFamily: 'inherit',
              }}
            >
              {label}
            </button>
          )
        })}
      </div>

      {/* URL Row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          background: 'rgba(0,0,0,0.3)',
          border: '1px solid rgba(255,255,255,0.06)',
          borderRadius: 10,
          padding: '13px 16px',
          flexWrap: 'wrap',
        }}
      >
        <code
          style={{
            flex: 1,
            fontFamily: "'Space Mono', monospace",
            fontSize: 13,
            color: endpointVal && endpointVal !== '#' ? '#7dd3fc' : '#334155',
            wordBreak: 'break-all',
          }}
        >
          {endpointVal && endpointVal !== '#'
            ? endpointVal
            : '— Not available for this network —'}
        </code>
        <CopyButton value={endpointVal} />
      </div>
    </div>
  )
}
