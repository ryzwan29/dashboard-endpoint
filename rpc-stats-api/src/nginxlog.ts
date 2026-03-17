// ============================================================
// src/nginxlog.ts
// Parse nginx access logs to get real request counts per chain
// ============================================================

import * as fs from 'fs'

export interface NginxStats {
  totalRequests: number
  requestsPerSec: number   // rolling avg over last 60s
  lastUpdated: Date
}

// Per-chain rolling window for rps calculation
interface Window {
  ts: number      // unix ms
  count: number   // total requests at that point
}

const windows = new Map<string, Window[]>()
const WINDOW_SECS = 60

// Read log file and count total lines (= total requests)
// Uses streaming tail — only reads last N bytes for efficiency
function countLogLines(logPath: string): number {
  try {
    if (!fs.existsSync(logPath)) return 0
    const content = fs.readFileSync(logPath, 'utf8')
    // Count non-empty lines
    return content.split('\n').filter(l => l.trim().length > 0).length
  } catch {
    return 0
  }
}

// For large log files, count lines efficiently using wc -l equivalent
function countLogLinesEfficient(logPath: string): number {
  try {
    if (!fs.existsSync(logPath)) return 0
    const stat = fs.statSync(logPath)
    if (stat.size === 0) return 0

    // Read last 64KB only for performance — count lines in tail
    // But for total count we need the full file
    // Use a buffer-based approach
    const fd = fs.openSync(logPath, 'r')
    const bufSize = 65536
    const buf = Buffer.alloc(bufSize)
    let count = 0
    let bytesRead = 0
    let pos = 0

    while (true) {
      bytesRead = fs.readSync(fd, buf, 0, bufSize, pos)
      if (bytesRead === 0) break
      for (let i = 0; i < bytesRead; i++) {
        if (buf[i] === 10) count++ // newline = 0x0A
      }
      pos += bytesRead
    }

    fs.closeSync(fd)
    return count
  } catch {
    return 0
  }
}

export function getNginxStats(logPath: string, chainId: string): NginxStats {
  const total = countLogLinesEfficient(logPath)
  const now = Date.now()

  // Rolling window for rps
  if (!windows.has(chainId)) windows.set(chainId, [])
  const win = windows.get(chainId)!

  win.push({ ts: now, count: total })

  // Keep only last WINDOW_SECS worth of samples
  const cutoff = now - WINDOW_SECS * 1000
  while (win.length > 1 && win[0].ts < cutoff) win.shift()

  let requestsPerSec = 0
  if (win.length >= 2) {
    const oldest = win[0]
    const newest = win[win.length - 1]
    const deltaReqs = newest.count - oldest.count
    const deltaSecs = (newest.ts - oldest.ts) / 1000
    requestsPerSec = deltaSecs > 0 ? Math.round(deltaReqs / deltaSecs) : 0
  }

  return {
    totalRequests: total,
    requestsPerSec: Math.max(0, requestsPerSec),
    lastUpdated: new Date(),
  }
}