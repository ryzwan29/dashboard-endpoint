import React from 'react'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts'
import { useDashboardStore, ChartRange } from '../hooks/useStore'
import { useChartData } from '../hooks/useChartData'
import { ChartTooltip } from './ChartTooltip'

const RANGES: ChartRange[] = ['24h', '7d', '30d']

export const RequestChart: React.FC = () => {
  const { chartRange, activeNetwork, setChartRange } = useDashboardStore()
  const data = useChartData(chartRange, activeNetwork.id, activeNetwork.chainId, activeNetwork.statsApi)

  return (
    <div
      style={{
        background: 'rgba(255,255,255,0.02)',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 16,
        padding: 24,
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 16,
          flexWrap: 'wrap',
          gap: 12,
        }}
      >
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#e2e8f0' }}>
            Request Volume
          </div>
          <div style={{ fontSize: 12, color: '#475569', marginTop: 2 }}>
            Total & cached requests over time
          </div>
        </div>

        {/* Range Buttons */}
        <div style={{ display: 'flex', gap: 4 }}>
          {RANGES.map((r) => (
            <button
              key={r}
              onClick={() => setChartRange(r)}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                border: 'none',
                background:
                  chartRange === r
                    ? 'rgba(77,136,255,0.18)'
                    : 'rgba(255,255,255,0.04)',
                color: chartRange === r ? '#7aadff' : '#64748b',
                fontSize: 12,
                fontWeight: chartRange === r ? 700 : 500,
                cursor: 'pointer',
                transition: 'all 0.15s',
                outline: chartRange === r ? '1px solid rgba(77,136,255,0.28)' : 'none',
                fontFamily: 'inherit',
              }}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: 16, marginBottom: 14 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: '#64748b',
          }}
        >
          <div
            style={{ width: 10, height: 10, borderRadius: 2, background: '#4d88ff' }}
          />
          Total Requests
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 12,
            color: '#64748b',
          }}
        >
          <div
            style={{ width: 10, height: 10, borderRadius: 2, background: '#22d3ee' }}
          />
          Cached Requests
        </div>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id="gTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4d88ff" stopOpacity={0.4} />
              <stop offset="100%" stopColor="#4d88ff" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gCached" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#22d3ee" stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.04)"
            vertical={false}
          />
          <XAxis
            dataKey="time"
            tick={{ fill: '#334155', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tickFormatter={(v) => `${(v / 1e6).toFixed(0)}M`}
            tick={{ fill: '#334155', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            width={38}
          />
          <Tooltip content={<ChartTooltip />} />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#4d88ff"
            strokeWidth={2}
            fill="url(#gTotal)"
          />
          <Area
            type="monotone"
            dataKey="cached"
            stroke="#22d3ee"
            strokeWidth={1.5}
            fill="url(#gCached)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}