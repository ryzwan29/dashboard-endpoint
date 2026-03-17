// ═══════════════════════════════════════════════════════════════
//  /src/data/index.ts  — ALL network configs live here
//  To add a new network: push one object into mainnetNetworks
//  or testnetNetworks. No component changes required.
// ═══════════════════════════════════════════════════════════════

export interface Network {
  id: number
  title: string
  symbol: string
  color: string
  // Endpoints — set "#" to mark as unavailable
  rpc: string
  wss: string
  rest: string
  grpc: string
  grpcWeb: string
  evm: string
  // Optional: point to your rpc-stats-api for live data
  statsApi?: string
  chainId: string   // used to hit /api/stats/:chainId
  // Fallback mock stats (shown when statsApi is not set)
  stats: {
    total: string
    cached: string
    avgRps: string
    curRps: string
    blockTime: string
  }
  // Optional: staking/explorer link — shown in the promo banner
  stake?: string
  // Logo image path in /public folder e.g. '/axone.png'
  logo?: string
}

const STATS_API = 'https://stats.provewithryd.xyz'

// ── MAINNETS ────────────────────────────────────────────────────
export const mainnetNetworks: Network[] = [
  {
    id: 1,
    title: 'Axone',
    symbol: 'axone-1',
    color: '#00d4ff',
    chainId: 'axone-1',
    statsApi: STATS_API,
    rpc:     'https://rpc-axone.provewithryd.xyz',
    wss:     'wss://wss-axone.provewithryd.xyz',
    grpc:    'https://grpc-axone.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://api-axone.provewithryd.xyz',
    evm:     '#',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/axone-mainnet/staking/axonevaloper1ytru6auvhmp0ygyeka6mkjzl80zf99uw3w8gcw',
    logo: '/axone.png',
  },
  {
    id: 2,
    title: 'Dungeon',
    symbol: 'dungeon-1',
    color: '#facc15',
    chainId: 'dungeon-1',
    statsApi: STATS_API,
    rpc:     'https://rpc-dungeon.provewithryd.xyz',
    wss:     'wss://wss-dungeon.provewithryd.xyz',
    grpc:    'https://grpc-dungeon.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://api-dungeon.provewithryd.xyz',
    evm:     '#',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/dungeon/staking',
    logo: '/dungeon.png',
  },
  {
    id: 3,
    title: 'Lumen',
    symbol: 'lumen',
    color: '#22c55e',
    chainId: 'lumen',
    statsApi: STATS_API,
    rpc:     'https://rpc-lumen.provewithryd.xyz',
    wss:     'wss://wss-lumen.provewithryd.xyz',
    grpc:    'https://grpc-lumen.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://api-lumen.provewithryd.xyz',
    evm:     '#',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/lumen/staking',
    logo: '/lumen.png',
  },
  {
    id: 4,
    title: 'Regen',
    symbol: 'regen-1',
    color: '#22c55e',
    chainId: 'regen-1',
    statsApi: STATS_API,
    rpc:     'https://rpc-regen.provewithryd.xyz',
    wss:     'wss://wss-regen.provewithryd.xyz',
    grpc:    'https://grpc-regen.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://api-regen.provewithryd.xyz',
    evm:     '#',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/regen/staking',
    logo: '/regen.png',
  },
  {
    id: 5,
    title: 'Medas Digital',
    symbol: 'medasdigital-2',
    color: '#3b7de8',
    chainId: 'medasdigital-2',
    statsApi: STATS_API,
    rpc:     'https://rpc-medas.provewithryd.xyz',
    wss:     'wss://wss-medas.provewithryd.xyz',
    grpc:    'https://grpc-medas.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://api-medas.provewithryd.xyz',
    evm:     '#',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/medasdigital/staking',
    logo: '/medas.png',
  },
]

// ── TESTNETS ────────────────────────────────────────────────────
export const testnetNetworks: Network[] = [
  {
    id: 1,
    title: 'Safrochain',
    symbol: 'safro-test-1',
    color: '#3b7de8',
    chainId: 'safro-test-1',
    statsApi: STATS_API,
    rpc:     'https://testnet-rpc-safrochain.provewithryd.xyz',
    wss:     'wss://testnet-wss-safrochain.provewithryd.xyz',
    grpc:    'https://testnet-grpc-safrochain.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://testnet-api-safrochain.provewithryd.xyz',
    evm:     '#',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/safrochain-testnet/staking',
    logo: '/safrochain.jpg',
  },
  {
    id: 2,
    title: 'Empeiria',
    symbol: 'empe-testnet-2',
    color: '#6366f1',
    chainId: 'empe-testnet-2',
    statsApi: STATS_API,
    rpc:     'https://testnet-rpc-empeiria.provewithryd.xyz',
    wss:     'wss://testnet-wss-empeiria.provewithryd.xyz',
    grpc:    'https://testnet-grpc-empeiria.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://testnet-api-empeiria.provewithryd.xyz',
    evm:     '#',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/empeiria-testnet/staking',
    logo: '/empeiria.png',
  },
  {
    id: 3,
    title: 'Pushchain',
    symbol: 'push_42101-1',
    color: '#ec4899',
    chainId: 'push_42101-1',
    statsApi: STATS_API,
    rpc:     'https://testnet-rpc-pushchain.provewithryd.xyz',
    wss:     'wss://testnet-wss-pushchain.provewithryd.xyz',
    grpc:    'https://testnet-grpc-pushchain.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://testnet-api-pushchain.provewithryd.xyz',
    evm:     'https://testnet-evm-pushchain.provewithryd.xyz',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/pushchain-testnet/staking',
    logo: '/pushchain.jpg',
  },
  {
    id: 4,
    title: 'Republic AI',
    symbol: 'raitestnet_77701-1',
    color: '#3b7de8',
    chainId: 'raitestnet_77701-1',
    statsApi: STATS_API,
    rpc:     'https://testnet-rpc-republic.provewithryd.xyz',
    wss:     'wss://testnet-wss-republic.provewithryd.xyz',
    grpc:    'https://testnet-grpc-republic.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://testnet-api-republic.provewithryd.xyz',
    evm:     'https://testnet-evm-republic.provewithryd.xyz',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/republic-testnet/staking',
    logo: '/republicai.jpg',
  },
  {
    id: 5,
    title: 'Kiichain',
    symbol: 'oro_1336-1',
    color: '#14b8a6',
    chainId: 'oro_1336-1',
    statsApi: STATS_API,
    rpc:     'https://testnet-rpc-kiichain.provewithryd.xyz',
    wss:     'wss://testnet-wss-kiichain.provewithryd.xyz',
    grpc:    'https://testnet-grpc-kiichain.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://testnet-api-kiichain.provewithryd.xyz',
    evm:     'https://testnet-evm-kiichain.provewithryd.xyz',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/kiichain-testnet/staking',
    logo: '/kiichain.png',
  },
]