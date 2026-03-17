// ============================================================
// chains.ts — ALL chain configs live here
// To add a new chain: append an entry to CHAINS
// ============================================================

export interface ChainConfig {
  chainId:      string
  name:         string
  metricsPort:  number
  restPort:     number
  rpcPort:      number
  evmPort?:     number   // optional — EVM JSON-RPC (e.g. 8545)
  wssPort?:     number   // optional — WebSocket RPC (e.g. 8546)
  testnet:      boolean
}

export const CHAINS: ChainConfig[] = [
  {
    chainId:     'axone-1',
    name:        'Axone',
    metricsPort: 10660,
    restPort:    10317,
    rpcPort:     10657,
    testnet:     false,
  },
  {
    chainId:     'dungeon-1',
    name:        'Dungeon',
    metricsPort: 11660,
    restPort:    11317,
    rpcPort:     11657,
    testnet:     false,
  },
  {
    chainId:     'medasdigital-2',
    name:        'Medas Digital',
    metricsPort: 12660,
    restPort:    12317,
    rpcPort:     12657,
    testnet:     false,
  },
  {
    chainId:     'regen-1',
    name:        'Regen',
    metricsPort: 13660,
    restPort:    13317,
    rpcPort:     13657,
    testnet:     false,
  },
  {
    chainId:     'lumen',
    name:        'Lumen',
    metricsPort: 15660,
    restPort:    15317,
    rpcPort:     15657,
    testnet:     false,
  },
  {
    chainId:     'safro-test-1',
    name:        'Safrochain',
    metricsPort: 50660,
    restPort:    50317,
    rpcPort:     50657,
    testnet:     true,
  },
  {
    chainId:     'empe-testnet-2',
    name:        'Empeiria',
    metricsPort: 51660,
    restPort:    51317,
    rpcPort:     51657,
    testnet:     true,
  },
  {
    chainId:     'oro_1336-1',
    name:        'Kiichain',
    metricsPort: 52660,
    restPort:    52317,
    rpcPort:     52657,
    evmPort:     52545,
    wssPort:     52546,
    testnet:     true,
  },
  {
    chainId:     'raitestnet_77701-1',
    name:        'Republic AI',
    metricsPort: 53660,
    restPort:    53317,
    rpcPort:     53657,
    evmPort:     53545,
    wssPort:     53546,
    testnet:     true,
  },
  {
    chainId:     'push_42101-1',
    name:        'Pushchain',
    metricsPort: 54660,
    restPort:    54317,
    rpcPort:     54657,
    evmPort:     54545,
    wssPort:     54546,
    testnet:     true,
  },
  // ── Add more chains here ──────────────────────────────────
  // {
  //   chainId:     'mychain-1',
  //   name:        'MyChain',
  //   metricsPort: 20660,
  //   restPort:    20317,
  //   rpcPort:     20657,
  //   evmPort:     20545,   // only if EVM-compatible
  //   wssPort:     20546,   // only if WSS supported
  //   testnet:     false,
  // },
]

export const CHAIN_MAP = new Map<string, ChainConfig>(
  CHAINS.map((c) => [c.chainId, c])
)