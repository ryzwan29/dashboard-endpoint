import { useMemo } from 'react'
import { ChartRange } from './useStore'

export interface ChartPoint {
  time: string
  total: number
  cached: number
}

export function useChartData(range: ChartRange, networkId: number): ChartPoint[] {
  return useMemo(() => {
    const n = range === '24h' ? 24 : range === '7d' ? 7 : 30
    const seed = networkId
    const base = 14_000_000 * (0.5 + seed * 0.08)

    return Array.from({ length: n }, (_, i) => {
      const wave =
        Math.sin(i * 0.9 + seed * 1.3) * 2_800_000 +
        Math.cos(i * 0.5 + seed) * 1_200_000
      const total = Math.max(8_000_000, base + wave + (Math.random() - 0.5) * 800_000)
      return {
        time: range === '24h' ? `${String(i).padStart(2, '0')}:00` : `D${i + 1}`,
        total: Math.round(total),
        cached: Math.round(total * (0.48 + seed * 0.004)),
      }
    })
  }, [range, networkId])
}
