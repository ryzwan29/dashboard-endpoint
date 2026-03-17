import React, { useRef, useEffect } from 'react'
import {
  Chart,
  LineElement,
  PointElement,
  LineController,
  CategoryScale,
  LinearScale,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js'
import { Network, TimeRange } from '../data'
import { useChartData } from '../hooks/useChartData'

Chart.register(LineElement, PointElement, LineController, CategoryScale, LinearScale, Filler, Tooltip, Legend)

function fmtNum(n: number): string {
  if (n >= 1e9) return (n / 1e9).toFixed(1) + 'B'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(0) + 'K'
  return String(Math.round(n))
}

const TIME_LABELS: Record<TimeRange, string> = {
  '24h': 'Last 24 hours',
  '7d': 'Last 7 days',
  '30d': 'Last 30 days',
}

interface Props {
  network: Network
  timeRange: TimeRange
}

export const RequestChart: React.FC<Props> = ({ network, timeRange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const chartRef = useRef<Chart | null>(null)
  const { labels, total, cached } = useChartData(network, timeRange)

  useEffect(() => {
    if (!canvasRef.current) return
    if (chartRef.current) chartRef.current.destroy()

    chartRef.current = new Chart(canvasRef.current, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Total',
            data: total,
            borderColor: '#3b7de8',
            backgroundColor: 'rgba(59,125,232,0.08)',
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: '#3b7de8',
          },
          {
            label: 'Cached',
            data: cached,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34,197,94,0.06)',
            borderWidth: 1.5,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4,
            pointHoverBackgroundColor: '#22c55e',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: { mode: 'index', intersect: false },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#131d2e',
            borderColor: '#1e2d47',
            borderWidth: 1,
            titleColor: '#94a3b8',
            bodyColor: '#e2e8f0',
            titleFont: { family: 'JetBrains Mono', size: 11 },
            bodyFont: { family: 'JetBrains Mono', size: 12 },
            padding: 10,
            callbacks: {
              label: (ctx) => `  ${ctx.dataset.label}: ${fmtNum(ctx.raw as number)}`,
            },
          },
        },
        scales: {
          x: {
            grid: { color: 'rgba(30,45,71,0.6)' },
            ticks: { color: '#4a5568', font: { family: 'JetBrains Mono', size: 10 }, maxTicksLimit: 8 },
          },
          y: {
            grid: { color: 'rgba(30,45,71,0.6)' },
            ticks: {
              color: '#4a5568',
              font: { family: 'JetBrains Mono', size: 10 },
              callback: (v) => fmtNum(v as number),
            },
          },
        },
      },
    })

    return () => {
      chartRef.current?.destroy()
    }
  }, [network.id, timeRange])

  return (
    <div
      style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 14,
        padding: 20,
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          {[
            { color: '#3b7de8', label: 'Total Requests' },
            { color: '#22c55e', label: 'Cached Requests' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ fontSize: 11, color: 'var(--text2)', fontFamily: 'var(--mono)' }}>{label}</span>
            </div>
          ))}
        </div>
        <span style={{ fontSize: 11, color: 'var(--text3)', fontFamily: 'var(--mono)' }}>
          {TIME_LABELS[timeRange]}
        </span>
      </div>

      {/* Chart */}
      <div style={{ position: 'relative', height: 200 }}>
        <canvas ref={canvasRef} />
      </div>
    </div>
  )
}
