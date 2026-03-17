import { useState, useEffect, useRef } from 'react'
import { Network } from '../data'

export type LatencyStatus = 'idle' | 'measuring' | 'online' | 'degraded' | 'offline'

export interface LatencyResult {
  ms: number | null
  status: LatencyStatus
  lastChecked: Date | null
}

const PING_INTERVAL_MS = 15_000
const TIMEOUT_MS = 6_000

export function useLatency(network: Network): LatencyResult {
  const [result, setResult] = useState<LatencyResult>({
    ms: null, status: 'idle', lastChecked: null,
  })
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    setResult({ ms: null, status: 'idle', lastChecked: null })

    const measure = async () => {
      if (!mountedRef.current) return
      setResult(prev => ({ ...prev, status: 'measuring' }))

      // If statsApi is set, ping /health — same server as node, most accurate
      const pingUrl = network.statsApi
        ? `${network.statsApi.replace(/\/$/, '')}/health`
        : network.rpc && network.rpc !== '#'
        ? network.rpc
        : null

      if (!pingUrl) {
        setResult({ ms: null, status: 'offline', lastChecked: new Date() })
        return
      }

      const t0 = performance.now()
      try {
        const init: RequestInit = {
          method: network.statsApi ? 'GET' : 'POST',
          signal: AbortSignal.timeout(TIMEOUT_MS),
          ...(!network.statsApi && {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ jsonrpc: '2.0', method: 'eth_blockNumber', params: [], id: 1 }),
          }),
        }
        await fetch(pingUrl, init)
        const ms = Math.round(performance.now() - t0)
        if (!mountedRef.current) return
        setResult({
          ms,
          status: ms < 400 ? 'online' : 'degraded',
          lastChecked: new Date(),
        })
      } catch {
        if (!mountedRef.current) return
        setResult({ ms: null, status: 'offline', lastChecked: new Date() })
      }
    }

    measure()
    const interval = setInterval(measure, PING_INTERVAL_MS)
    return () => {
      mountedRef.current = false
      clearInterval(interval)
    }
  }, [network.id])

  return result
}