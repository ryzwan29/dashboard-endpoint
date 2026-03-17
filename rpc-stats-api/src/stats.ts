import { scrapeMetrics } from './prometheus'
import { ChainConfig } from './chains'

export interface NetworkStats {
  chainId:            string
  name:               string
  testnet:            boolean
  // Endpoint availability flags — frontend uses these to enable/disable tabs
  hasEvm:             boolean
  hasWss:             boolean
  // Block info
  latestBlockHeight:  number
  blockTime:          number
  syncing:            boolean
  // Traffic
  totalRequests:      number
  cachedRequests:     number
  cachedPct:          number
  avgRps:             number
  curRps:             number
  // EVM-specific (only populated if evmPort is set)
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

// Per-chain rolling sample buffer for RPS
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

// Fetch EVM block number + chainId via eth_blockNumber / eth_chainId JSON-RPC
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

  // Run Prometheus scrape + optional EVM fetch in parallel
  const [metrics, evmStats] = await Promise.all([
    scrapeMetrics(prometheusUrl).catch(() => null),
    chain.evmPort ? fetchEvmStats(chain.evmPort) : Promise.resolve(null),
  ])

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
      totalRequests:     0,
      cachedRequests:    0,
      cachedPct:         0,
      avgRps:            0,
      curRps:            0,
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

  const totalRequests =
    metrics.get('tendermint_rpc_request_duration_seconds_count') ??
    metrics.get('cometbft_rpc_request_duration_seconds_count') ?? 0

  const cachedRequests =
    metrics.get('rpccache_hits_total') ??
    metrics.get('rpc_cache_hits_total') ?? 0

  const cachedPct =
    totalRequests > 0
      ? parseFloat(((cachedRequests / totalRequests) * 100).toFixed(2))
      : 0

  const memUsageBytes =
    metrics.get('go_memstats_alloc_bytes') ??
    metrics.get('process_resident_memory_bytes') ?? 0

  const { avgRps, curRps } = computeRps(chain.chainId, totalRequests)

  return {
    chainId:           chain.chainId,
    name:              chain.name,
    testnet:           chain.testnet,
    hasEvm:            !!chain.evmPort,
    hasWss:            !!chain.wssPort,
    latestBlockHeight,
    blockTime,
    syncing,
    totalRequests,
    cachedRequests,
    cachedPct,
    avgRps,
    curRps,
    numPeers,
    memUsageMB:        parseFloat((memUsageBytes / 1024 / 1024).toFixed(1)),
    goRoutines:        metrics.get('go_goroutines') ?? 0,
    // EVM extras
    ...(evmStats ?? {}),
    timestamp:         Date.now(),
    scrapeOk:          true,
  }
}