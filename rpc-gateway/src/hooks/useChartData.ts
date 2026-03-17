import { useState, useEffect } from 'react'
import { ChartRange } from './useStore'

export interface ChartPoint {
  time:   string
  total:  number
  cached: number
}

// Fallback mock data when API has no history yet
function mockData(range: ChartRange, networkId: number): ChartPoint[] {
  const n    = range === '24h' ? 24 : range === '7d' ? 7 : 30
  const seed = networkId
  const base = 2_000 * (0.5 + seed * 0.08)

  return Array.from({ length: n }, (_, i) => {
    const wave  = Math.sin(i * 0.9 + seed * 1.3) * 400
    const total = Math.max(200, Math.round(base + wave + (Math.random() - 0.5) * 200))
    return {
      time:   range === '24h' ? `${String(i).padStart(2, '0')}:00` : `D${i + 1}`,
      total,
      cached: Math.round(total * 0.4),
    }
  })
}

export function useChartData(
  range: ChartRange,
  networkId: number,
  chainId: string,
  statsApi?: string
): ChartPoint[] {
  const [data, setData] = useState<ChartPoint[]>(() => mockData(range, networkId))

  useEffect(() => {
    if (!statsApi) {
      setData(mockData(range, networkId))
      return
    }

    let cancelled = false

    const fetchHistory = async () => {
      try {
        const url = `${statsApi.replace(/\/$/, '')}/api/history/${chainId}?range=${range}`
        const res = await fetch(url, { signal: AbortSignal.timeout(8000) })
        if (!res.ok) throw new Error(`HTTP ${res.status}`)

        const json = await res.json() as {
          chainId: string
          range: string
          data: Array<{ time: string; total: number; cumulative: number }>
        }

        if (cancelled) return

        if (!json.data || json.data.length < 3) {
          // Not enough history yet — use mock
          setData(mockData(range, networkId))
          return
        }

        setData(json.data.map(p => ({
          time:   p.time,
          total:  p.total,
          cached: 0,   // no cache tracking yet
        })))
      } catch {
        if (!cancelled) setData(mockData(range, networkId))
      }
    }

    fetchHistory()
    return () => { cancelled = true }
  }, [range, networkId, chainId, statsApi])

  return data
}