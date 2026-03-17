import { useMemo } from 'react'
import { Network, TimeRange } from '../data'

export interface ChartData {
  labels: string[]
  total: number[]
  cached: number[]
}

export function useChartData(network: Network, range: TimeRange): ChartData {
  return useMemo(() => {
    const pts = range === '24h' ? 24 : range === '7d' ? 28 : 30
    const labels: string[] = []
    const total: number[] = []
    const cached: number[] = []
    const base = network.avgRps * 3600
    const now = new Date()

    // Use deterministic seed per network+range to avoid re-render flicker
    const seed = network.id * 100 + (range === '24h' ? 0 : range === '7d' ? 1 : 2)
    const rng = (i: number) => {
      const x = Math.sin(seed + i) * 10000
      return x - Math.floor(x)
    }

    for (let i = pts; i >= 0; i--) {
      const d = new Date(now)
      if (range === '24h') d.setHours(d.getHours() - i)
      else if (range === '7d') d.setDate(d.getDate() - Math.floor(i / 4))
      else d.setDate(d.getDate() - i)

      if (range === '24h') {
        labels.push(d.getHours().toString().padStart(2, '0') + ':00')
      } else {
        labels.push(`${d.getMonth() + 1}/${d.getDate()}`)
      }

      const noise = 0.65 + rng(i) * 0.7
      const t = Math.round(base * noise)
      total.push(t)
      cached.push(Math.round(t * (network.cachedPct / 100)))
    }

    return { labels, total, cached }
  }, [network.id, range])
}
