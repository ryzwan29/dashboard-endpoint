import { useState, useEffect, useRef } from 'react'

export interface NodeStats {
  chainId:            string
  name:               string
  testnet:            boolean
  latestBlockHeight:  number
  blockTime:          number
  syncing:            boolean
  totalRequests:      number
  cachedRequests:     number
  cachedPct:          number
  avgRps:             number
  curRps:             number
  numPeers:           number
  memUsageMB:         number
  goRoutines:         number
  timestamp:          number
  scrapeOk:           boolean
  scrapeError?:       string
}

export type FetchStatus = 'idle' | 'loading' | 'ok' | 'error'

interface UseNodeStatsResult {
  stats:        NodeStats | null
  status:       FetchStatus
  error:        string | null
  lastUpdated:  Date | null
}

const POLL_INTERVAL_MS = 10_000

export function useNodeStats(
  statsApiBase: string | null,   // e.g. 'https://stats.yourdomain.com'
  chainId:      string | null    // e.g. 'axone-1'
): UseNodeStatsResult {
  const [stats,       setStats]       = useState<NodeStats | null>(null)
  const [status,      setStatus]      = useState<FetchStatus>('idle')
  const [error,       setError]       = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true

    if (!statsApiBase || !chainId) {
      setStatus('idle')
      setStats(null)
      return
    }

    // e.g. https://stats.yourdomain.com/api/stats/axone-1
    const url = `${statsApiBase.replace(/\/$/, '')}/api/stats/${chainId}`

    const fetchStats = async () => {
      if (!mountedRef.current) return
      setStatus('loading')
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const data: NodeStats = await res.json()
        if (!mountedRef.current) return
        setStats(data)
        setStatus(data.scrapeOk ? 'ok' : 'error')
        setError(data.scrapeError ?? null)
        setLastUpdated(new Date())
      } catch (err: any) {
        if (!mountedRef.current) return
        setStatus('error')
        setError(err?.message ?? 'Failed to fetch stats')
      }
    }

    fetchStats()
    const interval = setInterval(fetchStats, POLL_INTERVAL_MS)
    return () => {
      mountedRef.current = false
      clearInterval(interval)
    }
  }, [statsApiBase, chainId])

  return { stats, status, error, lastUpdated }
}
