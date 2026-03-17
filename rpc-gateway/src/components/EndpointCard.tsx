import React, { useState } from 'react'
import { useGatewayStore } from '../hooks/useGatewayStore'
import { TABS } from '../data'

export const EndpointCard: React.FC = () => {
  const { activeNetwork, activeTab, setActiveTab } = useGatewayStore()
  const [copied, setCopied] = useState(false)

  const currentTab = TABS.find((t) => t.key === activeTab)!
  const url = activeNetwork[currentTab.field]
  const isDisabled = !url || url === '#'

  const handleCopy = async () => {
    if (isDisabled) return
    try {
      await navigator.clipboard.writeText(url)
    } catch {
      const ta = document.createElement('textarea')
      ta.value = url
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      document.execCommand('copy')
      document.body.removeChild(ta)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleMetaMask = () => {
    const evmUrl = activeNetwork.evm
    if (!evmUrl || evmUrl === '#') return
    if (typeof (window as any).ethereum !== 'undefined') {
      ;(window as any).ethereum
        .request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId: '0x' + parseInt(activeNetwork.chainId).toString(16),
              chainName: activeNetwork.title,
              rpcUrls: [evmUrl],
              nativeCurrency: { name: activeNetwork.title, symbol: activeNetwork.ticker, decimals: 18 },
            },
          ],
        })
        .catch(() => {})
    }
  }

  const hasEvm = activeNetwork.evm && activeNetwork.evm !== '#'

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        marginBottom: 20,
        overflow: 'hidden',
      }}
    >
      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid var(--border)',
          padding: '0 4px',
        }}
      >
        {TABS.map((tab) => {
          const val = activeNetwork[tab.field]
          const disabled = !val || val === '#'
          const isActive = activeTab === tab.key
          return (
            <button
              key={tab.key}
              disabled={disabled}
              onClick={() => setActiveTab(tab.key)}
              style={{
                padding: '12px 16px',
                fontSize: 12,
                fontWeight: 500,
                fontFamily: 'var(--mono)',
                border: 'none',
                background: 'transparent',
                color: isActive ? 'var(--accent2)' : disabled ? 'var(--text3)' : 'var(--text2)',
                cursor: disabled ? 'not-allowed' : 'pointer',
                borderBottom: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                marginBottom: -1,
                transition: 'all .2s',
                letterSpacing: '.3px',
                opacity: disabled ? 0.3 : 1,
              }}
            >
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Body */}
      <div style={{ padding: 20 }}>
        <div
          style={{
            fontSize: 11,
            color: 'var(--text3)',
            fontFamily: 'var(--mono)',
            letterSpacing: '.8px',
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Endpoint URL
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div
            style={{
              flex: 1,
              background: 'var(--bg)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '12px 16px',
              fontFamily: 'var(--mono)',
              fontSize: 13,
              color: isDisabled ? 'var(--text3)' : 'var(--accent2)',
              opacity: isDisabled ? 0.5 : 1,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {isDisabled ? 'Not available for this network' : url}
          </div>

          {/* MetaMask button (only for EVM networks) */}
          {hasEvm && (
            <button
              onClick={handleMetaMask}
              title="Add to MetaMask"
              style={{
                padding: '11px 14px',
                borderRadius: 10,
                border: '1px solid var(--border2)',
                background: 'var(--surface2)',
                cursor: 'pointer',
                transition: 'all .2s',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 35 33" fill="none">
                <path d="M32.96 1L19.4 10.8l2.45-5.8L32.96 1z" fill="#E17726" stroke="#E17726" strokeWidth=".25" />
                <path d="M2.04 1l13.46 9.9-2.33-5.9L2.04 1z" fill="#E27625" stroke="#E27625" strokeWidth=".25" />
                <path d="M28.1 23.5l-3.6 5.5 7.7 2.1 2.2-7.5-6.3-.1z" fill="#E27625" stroke="#E27625" strokeWidth=".25" />
                <path d="M1.5 23.6l2.2 7.5 7.7-2.1-3.6-5.5-6.3.1z" fill="#E27625" stroke="#E27625" strokeWidth=".25" />
                <path d="M11 14.6l-2.1 3.2 7.5.35-.25-8.1L11 14.6z" fill="#E27625" stroke="#E27625" strokeWidth=".25" />
                <path d="M24 14.6l-5.2-4.65-.17 8.15 7.5-.35L24 14.6z" fill="#E27625" stroke="#E27625" strokeWidth=".25" />
                <path d="M11.4 29l4.5-2.2-3.9-3-.6 5.2z" fill="#E27625" stroke="#E27625" strokeWidth=".25" />
                <path d="M19.1 26.8l4.5 2.2-.6-5.2-3.9 3z" fill="#E27625" stroke="#E27625" strokeWidth=".25" />
              </svg>
            </button>
          )}

          {/* Copy button */}
          <button
            disabled={isDisabled}
            onClick={handleCopy}
            style={{
              padding: '11px 20px',
              borderRadius: 10,
              border: 'none',
              background: isDisabled
                ? 'var(--surface2)'
                : 'linear-gradient(135deg,var(--accent),#1e40af)',
              color: '#fff',
              fontSize: 13,
              fontFamily: 'var(--sans)',
              fontWeight: 500,
              cursor: isDisabled ? 'not-allowed' : 'pointer',
              transition: 'all .2s',
              whiteSpace: 'nowrap',
              display: 'flex',
              alignItems: 'center',
              gap: 7,
              opacity: isDisabled ? 0.3 : 1,
            }}
          >
            {copied ? (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <rect x="9" y="9" width="13" height="13" rx="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
