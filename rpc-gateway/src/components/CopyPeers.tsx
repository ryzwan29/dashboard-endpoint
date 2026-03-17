import React, { useState } from 'react'
import { Network } from '../data'

interface Props {
  net: Network
}

type Status = 'idle' | 'loading' | 'done' | 'error'

async function copyToClipboard(text: string): Promise<void> {
  // navigator.clipboard only works on HTTPS / localhost
  if (navigator?.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }
  // Fallback for HTTP or older mobile browsers
  const ta = document.createElement('textarea')
  ta.value = text
  ta.style.cssText = 'position:fixed;top:-9999px;left:-9999px;opacity:0'
  document.body.appendChild(ta)
  ta.focus()
  ta.select()
  const ok = document.execCommand('copy')
  document.body.removeChild(ta)
  if (!ok) throw new Error('Copy not supported on this browser')
}

export const CopyPeers: React.FC<Props> = ({ net }) => {
  const [status, setStatus] = useState<Status>('idle')
  const [errorMsg, setErrorMsg] = useState('')

  if (!net.rpc || net.rpc === '#') return null

  const handleCopy = async () => {
    if (status === 'loading') return
    setStatus('loading')
    setErrorMsg('')

    try {
      const res = await fetch(`${net.rpc}/net_info`)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const json = await res.json()

      const peers: string[] = (json?.result?.peers ?? []).map((p: any) => {
        const id       = p?.node_info?.id ?? ''
        const remoteIp = p?.remote_ip ?? ''
        const listenAddr: string = p?.node_info?.listen_addr ?? ''
        const port = listenAddr.split(':').pop() ?? '26656'
        return `${id}@${remoteIp}:${port}`
      }).filter(Boolean)

      if (peers.length === 0) throw new Error('No peers found')

      await copyToClipboard(peers.join(','))
      setStatus('done')
      setTimeout(() => setStatus('idle'), 3000)
    } catch (e: any) {
      setErrorMsg(e?.message ?? 'Failed')
      setStatus('error')
      setTimeout(() => setStatus('idle'), 4000)
    }
  }

  const label = {
    idle:    '⎘  Copy Peers',
    loading: '⏳ Fetching…',
    done:    '✓  Copied!',
    error:   `✕  ${errorMsg}`,
  }[status]

  const bg = {
    idle:    'rgba(255,255,255,0.05)',
    loading: 'rgba(255,255,255,0.05)',
    done:    'rgba(34,197,94,0.15)',
    error:   'rgba(239,68,68,0.15)',
  }[status]

  const border = {
    idle:    'rgba(255,255,255,0.1)',
    loading: 'rgba(255,255,255,0.1)',
    done:    'rgba(34,197,94,0.4)',
    error:   'rgba(239,68,68,0.4)',
  }[status]

  const color = {
    idle:    '#94a3b8',
    loading: '#64748b',
    done:    '#22c55e',
    error:   '#ef4444',
  }[status]

  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 14,
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        flexWrap: 'wrap',
      }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#f1f5f9', marginBottom: 3 }}>
            Peers
          </div>
          <div style={{ fontSize: 12, color: '#475569' }}>
            Fetch live peers from <code style={{ fontFamily: "'Space Mono', monospace", color: '#64748b', fontSize: 11 }}>{net.rpc}/net_info</code>
          </div>
        </div>

        <button
          onClick={handleCopy}
          disabled={status === 'loading'}
          style={{
            padding: '8px 16px',
            borderRadius: 9,
            border: `1px solid ${border}`,
            background: bg,
            color,
            fontSize: 12,
            fontWeight: 700,
            cursor: status === 'loading' ? 'not-allowed' : 'pointer',
            transition: 'all 0.2s',
            whiteSpace: 'nowrap',
            fontFamily: "'Syne', sans-serif",
            flexShrink: 0,
          }}
        >
          {label}
        </button>
      </div>
    </div>
  )
}