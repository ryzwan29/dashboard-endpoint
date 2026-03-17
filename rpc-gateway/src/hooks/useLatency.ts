import { useState, useEffect, useCallback, useRef } from 'react'
import { Network } from '../data'

export type LatencyStatus = 'idle' | 'measuring' | 'online' | 'degraded' | 'offline'

export interface LatencyResult {
  ms: number | null        // null = not yet measured / offline
  status: LatencyStatus
  lastChecked: Date | null
  history: number[]        // last N measurements for sparkline
}

const PING_INTERVAL_MS = 15_000   // re-ping every 15s
const TIMEOUT_MS       = 8_000    // mark offline after 8s no response
const MAX_HISTORY      = 20       // keep last 20 samples

// For EVM-compatible chains we send eth_blockNumber (tiny payload, always supported)
// For Cosmos/non-EVM REST chains we hit the /status endpoint
// For WSS endpoints we measure the HTTP RPC instead
function buildPingPayload(network: Network): { url: string; init: RequestInit } {
  const isEvm = network.evm && network.evm !== '#'
  const rpcUrl = isEvm ? network.evm : network.rpc

  // If it's clearly a Cosmos REST endpoint or non-EVM, try a lightweight path
  const isCosmosRest =
    !isEvm &&
    network.rest &&
    network.rest !== '#' &&
    (network.chainId.includes('-') || isNaN(Number(network.chainId)))

  if (isCosmosRest) {
    // Cosmos: GET /cosmos/base/tendermint/v1beta1/node_info is tiny
    return {
      url: network.rest + '/cosmos/base/tendermint/v1beta1/node_info',
      init: { method: 'GET', signal: AbortSignal.timeout(TIMEOUT_MS) },
    }
  }

  // EVM / generic JSON-RPC
  return {
    url: rpcUrl,
    init: {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    },
  }
}

export function useLatency(network: Network): LatencyResult {
  const [result, setResult] = useState<LatencyResult>({
    ms: network.latency, // seed with static value so UI isn't blank on load
    status: 'idle',
    lastChecked: null,
    history: [network.latency],
  })

  const historyRef = useRef<number[]>([network.latency])
  const mountedRef = useRef(true)

  const measure = useCallback(async () => {
    if (!mountedRef.current) return

    setResult((prev) => ({ ...prev, status: 'measuring' }))

    const { url, init } = buildPingPayload(network)
    const t0 = performance.now()

    try {
      const res = await fetch(url, init)
      const ms = Math.round(performance.now() - t0)

      // Accept any 2xx or even 4xx — we only care the server responded
      if (!mountedRef.current) return

      const status: LatencyStatus = ms < 400 ? 'online' : ms < 1200 ? 'degraded' : 'degraded'

      historyRef.current = [...historyRef.current.slice(-(MAX_HISTORY - 1)), ms]

      setResult({
        ms,
        status,
        lastChecked: new Date(),
        history: [...historyRef.current],
      })
    } catch {
      if (!mountedRef.current) return
      // Timeout or network error
      historyRef.current = [...historyRef.current.slice(-(MAX_HISTORY - 1))]
      setResult({
        ms: null,
        status: 'offline',
        lastChecked: new Date(),
        history: [...historyRef.current],
      })
    }
  }, [network.id])

  useEffect(() => {
    mountedRef.current = true
    historyRef.current = [network.latency]

    // Reset to seed value on network change
    setResult({
      ms: network.latency,
      status: 'idle',
      lastChecked: null,
      history: [network.latency],
    })

    // First ping immediately, then on interval
    measure()
    const interval = setInterval(measure, PING_INTERVAL_MS)

    return () => {
      mountedRef.current = false
      clearInterval(interval)
    }
  }, [network.id])

  return result
}
