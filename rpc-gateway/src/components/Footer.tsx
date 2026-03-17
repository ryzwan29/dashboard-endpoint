import React from 'react'

interface Props {
  mainnetCount: number
  testnetCount: number
}

export const Footer: React.FC<Props> = ({ mainnetCount, testnetCount }) => {
  return (
    <footer
      style={{
        borderTop: '1px solid rgba(255,255,255,0.05)',
        background: 'rgba(6,9,20,0.98)',
        zIndex: 10,
        flexShrink: 0,
      }}
    >
      {/* Main footer content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 0,
          borderBottom: '1px solid rgba(255,255,255,0.04)',
        }}
      >
        {/* Left — Brand */}
        <div
          style={{
            padding: '28px 36px',
            borderRight: '1px solid rgba(255,255,255,0.04)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 32, height: 32, borderRadius: 9,
                background: 'linear-gradient(135deg,#4d88ff,#1a3db5)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 17, boxShadow: '0 4px 16px #4d88ff44',
              }}
            >
              <img src="/logo.png" alt="logo" style={{ width: 32, height: 32, borderRadius: 9, objectFit: 'contain' }} />
            </div>
            <span
              style={{
                fontSize: 14, fontWeight: 700, color: '#f8fafc',
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}
            >
              RydOne Public RPC
            </span>
          </div>
          <p style={{ fontSize: 13, color: '#475569', lineHeight: 1.6, maxWidth: 280, margin: '0 0 14px' }}>
            Professional blockchain infrastructure and
            open-source RPC gateway for the decentralized web.
          </p>
          {/* Social icons */}
          <div style={{ display: 'flex', gap: 8 }}>
            {[
              {
                href: 'https://provewithryd.xyz',
                label: 'Website',
                img: '/website.png',
              },
              {
                href: 'https://github.com/ryzwan29',
                label: 'GitHub',
                img: '/git.svg',
              },
              {
                href: 'https://x.com/Ryddd29',
                label: 'Twitter',
                img: '/twit.svg',
              },
              {
                href: 'https://t.me/Ryddd29',
                label: 'Telegram',
                img: '/telegram.svg',
              },
            ].map(({ href, label, img }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                title={label}
                style={{
                  width: 34, height: 34, borderRadius: 8,
                  border: '1px solid rgba(255,255,255,0.08)',
                  background: 'rgba(255,255,255,0.03)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none', transition: 'all 0.2s', flexShrink: 0,
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(77,136,255,0.4)'
                  ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(77,136,255,0.08)'
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255,255,255,0.08)'
                  ;(e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.03)'
                }}
              >
                <img
                  src={img}
                  alt={label}
                  style={{ width: 18, height: 18, objectFit: 'contain', opacity: 0.6 }}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none' }}
                />
              </a>
            ))}
          </div>
        </div>

        {/* Right — Network Status */}
        <div style={{ padding: '28px 36px' }}>
          <div
            style={{
              fontSize: 11, fontWeight: 700, color: '#4d88ff',
              letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 16,
            }}
          >
            Network Status
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { label: 'Mainnet Chains', value: `${mainnetCount} Active`, color: '#4d88ff' },
              { label: 'Testnet Chains', value: `${testnetCount} Active`, color: '#4d88ff' },
              { label: 'Slashing History', value: '0 Events', color: '#22c55e' },
              { label: 'Average Uptime',   value: '99%',      color: '#22c55e' },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
              >
                <span style={{ fontSize: 13, color: '#475569' }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color }}>{value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 36px',
        }}
      >
        <span style={{ fontSize: 11, color: '#1e293b' }}>
          © 2026 NodeGate · provewithryd.xyz · MIT Licensed.
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span
            style={{
              width: 6, height: 6, borderRadius: '50%',
              background: '#22c55e',
              display: 'inline-block',
              boxShadow: '0 0 6px #22c55e',
            }}
          />
          <span style={{ fontSize: 11, color: '#334155' }}>All systems operational</span>
        </div>
      </div>
    </footer>
  )
}