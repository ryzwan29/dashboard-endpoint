import { scrapeMetrics } from './prometheus'
import { getNginxStats } from './nginxlog'
import { ChainConfig } from './chains'

export interface NetworkStats {
  chainId:            string
  name:               string
  testnet:            boolean
  hasEvm:             boolean
  hasWss:             boolean
  latestBlockHeight:  number
  blockTime:          number
  syncing:            boolean
  // Traffic — from nginx access log
  totalRequests:      number
  cachedRequests:     number
  cachedPct:          number
  avgRps:             number
  curRps:             number
  // EVM extras
  evmBlockNumber?:    number
  evmChainId?:        string
  // Node health
  numPeers:           number
  memUsageMB:         number
  goRoutines:         number
  timestamp:          number
  scrapeOk:           boolean
  scrapeError?:       string
}

// Per-chain RPS sample buffer (from nginx)
interface Sample { ts: number; totalReqs: number }
const sampleBuffers = new Map<string, Sample[]>()
const SAMPLE_WINDOW = 60

function computeRps(chainId: string, current: number): { avgRps: number; curRps: number } {
  if (!sampleBuffers.has(chainId)) sampleBuffers.set(chainId, [])
  const samples = sampleBuffers.get(chainId)!
  samples.push({ ts: Date.now(), totalReqs: current })
  while (samples.length > SAMPLE_WINDOW) samples.shift()
  if (samples.length < 2) return { avgRps: 0, curRps: 0 }
  const oldest = samples[0]
  const newest = samples[samples.length - 1]
  const prev   = samples[samples.length - 2]
  const avgRps = Math.round((newest.totalReqs - oldest.totalReqs) / ((newest.ts - oldest.ts) / 1000))
  const curRps = Math.round((newest.totalReqs - prev.totalReqs)   / ((newest.ts - prev.ts)   / 1000))
  return { avgRps: Math.max(0, avgRps), curRps: Math.max(0, curRps) }
}

async function fetchEvmStats(evmPort: number): Promise<{ evmBlockNumber: number; evmChainId: string } | null> {
  try {
    const axios = await import('axios')
    const res = await axios.default.post(
      `http://localhost:${evmPort}`,
      [
        { jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 },
        { jsonrpc: '2.0', method: 'eth_chainId',     params: [], id: 2 },
      ],
      { timeout: 4000, headers: { 'Content-Type': 'application/json' } }
    )
    const results = res.data as Array<{ id: number; result: string }>
    const blockHex   = results.find(r => r.id === 1)?.result ?? '0x0'
    const chainIdHex = results.find(r => r.id === 2)?.result ?? '0x0'
    return {
      evmBlockNumber: parseInt(blockHex, 16),
      evmChainId:     String(parseInt(chainIdHex, 16)),
    }
  } catch {
    return null
  }
}

export async function buildStats(chain: ChainConfig): Promise<NetworkStats> {
  const prometheusUrl = `http://localhost:${chain.metricsPort}/metrics`

  const [metrics, evmStats] = await Promise.all([
    scrapeMetrics(prometheusUrl).catch(() => null),
    chain.evmPort ? fetchEvmStats(chain.evmPort) : Promise.resolve(null),
  ])

  // ── Nginx log stats (real request counts) ──────────────────
  const nginx = getNginxStats(chain.logFile, chain.chainId)
  const { avgRps, curRps } = computeRps(chain.chainId, nginx.totalRequests)

  if (!metrics) {
    return {
      chainId:           chain.chainId,
      name:              chain.name,
      testnet:           chain.testnet,
      hasEvm:            !!chain.evmPort,
      hasWss:            !!chain.wssPort,
      latestBlockHeight: 0,
      blockTime:         0,
      syncing:           false,
      totalRequests:     nginx.totalRequests,
      cachedRequests:    0,
      cachedPct:         0,
      avgRps,
      curRps,
      numPeers:          0,
      memUsageMB:        0,
      goRoutines:        0,
      timestamp:         Date.now(),
      scrapeOk:          false,
      scrapeError:       'Prometheus unreachable',
    }
  }

  const latestBlockHeight =
    metrics.get('tendermint_consensus_height') ??
    metrics.get('cometbft_consensus_height') ?? 0

  const blockIntervalSum =
    metrics.get('tendermint_consensus_block_interval_seconds_sum') ??
    metrics.get('cometbft_consensus_block_interval_seconds_sum') ?? null

  const blockIntervalCount =
    metrics.get('tendermint_consensus_block_interval_seconds_count') ??
    metrics.get('cometbft_consensus_block_interval_seconds_count') ?? null

  const blockTime =
    blockIntervalSum !== null && blockIntervalCount && blockIntervalCount > 0
      ? parseFloat((blockIntervalSum / blockIntervalCount).toFixed(2))
      : 6.0

  const numPeers =
    metrics.get('tendermint_p2p_peers') ??
    metrics.get('cometbft_p2p_peers') ?? 0

  const syncing =
    (metrics.get('tendermint_consensus_fast_syncing') ??
     metrics.get('cometbft_blocksync_syncing') ?? 0) === 1

  const memUsageBytes =
    metrics.get('go_memstats_alloc_bytes') ??
    metrics.get('process_resident_memory_bytes') ?? 0

  return {
    chainId:           chain.chainId,
    name:              chain.name,
    testnet:           chain.testnet,
    hasEvm:            !!chain.evmPort,
    hasWss:            !!chain.wssPort,
    latestBlockHeight,
    blockTime,
    syncing,
    // Real traffic data from nginx
    totalRequests:     nginx.totalRequests,
    cachedRequests:    0,   // nginx doesn't track cache — needs proxy cache setup
    cachedPct:         0,
    avgRps,
    curRps,
    numPeers,
    memUsageMB:        parseFloat((memUsageBytes / 1024 / 1024).toFixed(1)),
    goRoutines:        metrics.get('go_goroutines') ?? 0,
    ...(evmStats ?? {}),
    timestamp:         Date.now(),
    scrapeOk:          true,
  }
}