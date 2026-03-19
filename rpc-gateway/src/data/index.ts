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
    wss:     '#',
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
    wss:     '#',
    grpc:    'https://grpc-dungeon.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://api-dungeon.provewithryd.xyz',
    evm:     '#',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/dungeon-mainnet/staking/dungeonvaloper108a82xy8ff9c6aw72rxs56yendq6spdvs88d8s',
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
    wss:     '#',
    grpc:    'https://grpc-lumen.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://api-lumen.provewithryd.xyz',
    evm:     '#',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/lumen-mainnet/staking/lmnvaloper1dj0s05mfxjqg36qwxapseqa0x2ta4tytplpqtf',
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
    wss:     '#',
    grpc:    'https://grpc-regen.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://api-regen.provewithryd.xyz',
    evm:     '#',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/regen-mainnet/staking/regenvaloper1zcll4k60y9v6edkht0xadexl62kjew36ezy799',
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
    wss:     '#',
    grpc:    'https://grpc-medas.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://api-medas.provewithryd.xyz',
    evm:     '#',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/medas-mainnet/staking/medasvaloper1npw0kkuh5gmw22nxpumax442fpxuz5uvu3atuq',
    logo: '/medas.png',
  },
  {
    id: 6,
    title: 'Zigchain',
    symbol: 'zigchain-1',
    color: '#3b7de8',
    chainId: 'zigchain-1',
    statsApi: STATS_API,
    rpc:     'https://rpc-zigchain.provewithryd.xyz',
    wss:     '#',
    grpc:    'https://grpc-zigchain.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://api-zigchain.provewithryd.xyz',
    evm:     '#',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/zigchain-mainnet/staking/zigvaloper1pjrjnkyunr8e8jrkgrzg4m64wp5tqzyeuf75yj',
    logo: '/zigchain.jpg',
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
    wss:     '#',
    grpc:    'https://testnet-grpc-safrochain.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://testnet-api-safrochain.provewithryd.xyz',
    evm:     '#',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/safrochain-testnet/staking/addr_safrovaloper1s9wdq776nhk39fv2qjxywp0s4t667ez00c55r2',
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
    wss:     '#',
    grpc:    'https://testnet-grpc-empeiria.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://testnet-api-empeiria.provewithryd.xyz',
    evm:     '#',
    stats: { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
    stake: 'https://explorer.provewithryd.xyz/empeiria-testnet/staking/empevaloper1llw20lql0cpdegy54j2dxqyd2ha5jeruhqgeln',
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
    stake: 'https://explorer.provewithryd.xyz/pushchain-testnet/staking/pushvaloper1ns0pn9z25cksgw55cl9rr72gqav74xpetudqpx',
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
    stake: 'https://explorer.provewithryd.xyz/republicai-testnet/staking/raivaloper1jnlw7aex7l7uwpjxx9e04yfj9ec0dt9utxzm6z',
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
    stake: 'https://explorer.provewithryd.xyz/kiichain-testnet/staking/kiivaloper1mlqcj3eq4dgqe826pn0w35juzwgjrdd4nf6avs',
    logo: '/kiichain.png',
  },
]