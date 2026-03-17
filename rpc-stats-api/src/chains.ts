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
  evmPort?:     number
  wssPort?:     number
  testnet:      boolean
  // Nginx access log path — all endpoints (rpc+api+evm+wss) log here
  // Run add-nginx-logs.sh first to set this up
  logFile:      string
}

export const CHAINS: ChainConfig[] = [
  {
    chainId:     'axone-1',
    name:        'Axone',
    metricsPort: 10660,
    restPort:    10317,
    rpcPort:     10657,
    testnet:     false,
    logFile:     '/var/log/nginx/axone.access.log',
  },
  {
    chainId:     'dungeon-1',
    name:        'Dungeon',
    metricsPort: 11660,
    restPort:    11317,
    rpcPort:     11657,
    testnet:     false,
    logFile:     '/var/log/nginx/dungeon.access.log',
  },
  {
    chainId:     'lumen',
    name:        'Lumen',
    metricsPort: 15660,
    restPort:    15317,
    rpcPort:     15657,
    testnet:     false,
    logFile:     '/var/log/nginx/lumen.access.log',
  },
  {
    chainId:     'regen-1',
    name:        'Regen',
    metricsPort: 13660,
    restPort:    13317,
    rpcPort:     13657,
    testnet:     false,
    logFile:     '/var/log/nginx/regen.access.log',
  },
  {
    chainId:     'medasdigital-2',
    name:        'Medas Digital',
    metricsPort: 11660,
    restPort:    11317,
    rpcPort:     11657,
    testnet:     false,
    logFile:     '/var/log/nginx/medas.access.log',
  },
  {
    chainId:     'safro-test-1',
    name:        'Safrochain',
    metricsPort: 50660,
    restPort:    50317,
    rpcPort:     50657,
    testnet:     true,
    logFile:     '/var/log/nginx/safrochain.access.log',
  },
  {
    chainId:     'empe-testnet-2',
    name:        'Empeiria',
    metricsPort: 51660,
    restPort:    51317,
    rpcPort:     51657,
    testnet:     true,
    logFile:     '/var/log/nginx/empeiria.access.log',
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
    logFile:     '/var/log/nginx/kiichain.access.log',
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
    logFile:     '/var/log/nginx/republic.access.log',
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
    logFile:     '/var/log/nginx/pushchain.access.log',
  },
]

export const CHAIN_MAP = new Map<string, ChainConfig>(
  CHAINS.map((c) => [c.chainId, c])
)