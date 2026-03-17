import axios from 'axios'

// Parse Prometheus text format into a flat key→value map
// Handles: gauges, counters, histograms (extracts _sum / _count)
export function parsePrometheusText(text: string): Map<string, number> {
  const result = new Map<string, number>()

  for (const line of text.split('\n')) {
    const trimmed = line.trim()
    // Skip comments and empty lines
    if (!trimmed || trimmed.startsWith('#')) continue

    // Match: metric_name{labels} value or metric_name value
    const spaceIdx = trimmed.lastIndexOf(' ')
    if (spaceIdx === -1) continue

    const rawName = trimmed.slice(0, spaceIdx).trim()
    const rawValue = trimmed.slice(spaceIdx + 1).trim()

    const value = parseFloat(rawValue)
    if (isNaN(value)) continue

    // Strip label block: metric{foo="bar"} → metric
    const labelStart = rawName.indexOf('{')
    const metricName = labelStart === -1 ? rawName : rawName.slice(0, labelStart)

    // For duplicate keys (multiple label combos), sum them up
    result.set(metricName, (result.get(metricName) ?? 0) + value)
  }

  return result
}

export interface RawMetrics {
  // Tendermint consensus
  latestBlockHeight: number
  latestBlockTime: number      // unix timestamp of last block
  blockIntervalSeconds: number // avg block time
  numPeers: number
  validatorMissedBlocks: number

  // RPC / p2p traffic
  rpcTotalRequests: number
  rpcCachedRequests: number    // only if caching middleware is present
  rpcRequestsPerSec: number    // derived

  // Node health
  memUsageBytes: number
  goRoutines: number
  syncingStatus: number        // 0 = synced, 1 = syncing
}

export async function scrapeMetrics(prometheusUrl: string): Promise<Map<string, number>> {
  const res = await axios.get<string>(prometheusUrl, {
    timeout: 5000,
    responseType: 'text',
    // Some nodes return gzip
    decompress: true,
  })
  return parsePrometheusText(res.data)
}
