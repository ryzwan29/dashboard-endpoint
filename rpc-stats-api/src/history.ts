// ============================================================
// src/history.ts
// Simpan snapshot request count per jam ke JSON file
// Dipakai untuk chart historical data di frontend
// ============================================================

import * as fs   from 'fs'
import * as path from 'path'

const HISTORY_FILE = process.env.HISTORY_FILE ?? '/var/lib/rpc-stats/history.json'
const MAX_POINTS   = 24 * 30   // simpan max 30 hari (720 data points per chain)

export interface HistoryPoint {
  ts:    number   // unix ms
  total: number   // total requests at that time
}

type HistoryStore = Record<string, HistoryPoint[]>

// ── Load / Save ───────────────────────────────────────────────
function load(): HistoryStore {
  try {
    if (!fs.existsSync(HISTORY_FILE)) return {}
    const raw = fs.readFileSync(HISTORY_FILE, 'utf8')
    return JSON.parse(raw) as HistoryStore
  } catch {
    return {}
  }
}

function save(store: HistoryStore): void {
  try {
    const dir = path.dirname(HISTORY_FILE)
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
    fs.writeFileSync(HISTORY_FILE, JSON.stringify(store), 'utf8')
  } catch (e) {
    console.error('[history] Failed to save:', e)
  }
}

// ── Public API ────────────────────────────────────────────────

// Called every hour — saves current total for a chain
export function recordSnapshot(chainId: string, total: number): void {
  const store = load()
  if (!store[chainId]) store[chainId] = []

  store[chainId].push({ ts: Date.now(), total })

  // Trim to max points
  if (store[chainId].length > MAX_POINTS) {
    store[chainId] = store[chainId].slice(-MAX_POINTS)
  }

  save(store)
}

// Get history for a chain filtered by range
export type Range = '24h' | '7d' | '30d'

export interface ChartPoint {
  time:  string   // formatted label
  total: number   // requests in this period (delta)
  cumulative: number  // running total
}

export function getHistory(chainId: string, range: Range): ChartPoint[] {
  const store = load()
  const points = store[chainId] ?? []

  if (points.length === 0) return []

  // Filter by range
  const now    = Date.now()
  const cutoff = range === '24h' ? now - 24 * 3600_000
               : range === '7d'  ? now -  7 * 24 * 3600_000
               :                   now - 30 * 24 * 3600_000

  const filtered = points.filter(p => p.ts >= cutoff)
  if (filtered.length < 2) return []

  // Convert to chart points — show delta per period (requests in that hour)
  return filtered.map((p, i) => {
    const prev  = i === 0 ? p : filtered[i - 1]
    const delta = Math.max(0, p.total - prev.total)
    const d     = new Date(p.ts)

    let label: string
    if (range === '24h') {
      label = `${String(d.getHours()).padStart(2, '0')}:00`
    } else {
      label = `${d.getMonth() + 1}/${d.getDate()}`
    }

    return {
      time:       label,
      total:      delta,
      cumulative: p.total,
    }
  })
}

// Get all chain IDs that have history
export function getChainIds(): string[] {
  const store = load()
  return Object.keys(store)
}