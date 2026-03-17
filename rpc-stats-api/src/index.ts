import express from 'express'
import cors from 'cors'
import { CHAINS, CHAIN_MAP } from './chains'
import { buildStats, NetworkStats } from './stats'

const PORT            = parseInt(process.env.PORT            ?? '3001')
const SCRAPE_INTERVAL = parseInt(process.env.SCRAPE_INTERVAL ?? '5000')
const ALLOWED_ORIGINS =          process.env.ALLOWED_ORIGINS ?? '*'

const app = express()

app.use(cors({
  origin: ALLOWED_ORIGINS === '*' ? '*' : ALLOWED_ORIGINS.split(',').map(s => s.trim()),
  methods: ['GET'],
}))

// ── In-memory cache: chainId → latest stats ──────────────────
const cache = new Map<string, NetworkStats>()

async function scrapeAll() {
  await Promise.allSettled(
    CHAINS.map(async (chain) => {
      const stats = await buildStats(chain)
      cache.set(chain.chainId, stats)
      if (stats.scrapeOk) {
        console.log(`[${chain.chainId}] block=${stats.latestBlockHeight} peers=${stats.numPeers} rps=${stats.curRps}`)
      } else {
        console.warn(`[${chain.chainId}] scrape failed: ${stats.scrapeError}`)
      }
    })
  )
}

// ── Routes ────────────────────────────────────────────────────

// Health — shows status of all chains
app.get('/health', (_req, res) => {
  const chains = CHAINS.map((c) => {
    const s = cache.get(c.chainId)
    return { chainId: c.chainId, name: c.name, ok: s?.scrapeOk ?? false }
  })
  res.json({ ok: true, uptime: process.uptime(), chains })
})

// All chains summary
app.get('/api/stats', (_req, res) => {
  if (cache.size === 0) {
    return res.status(503).json({ error: 'Not ready yet, try again in a few seconds' })
  }
  res.json(Object.fromEntries(cache))
})

// Single chain stats — used by dashboard per network
app.get('/api/stats/:chainId', (req, res) => {
  const { chainId } = req.params
  if (!CHAIN_MAP.has(chainId)) {
    return res.status(404).json({ error: `Unknown chain: ${chainId}` })
  }
  const stats = cache.get(chainId)
  if (!stats) {
    return res.status(503).json({ error: 'Stats not yet available' })
  }
  res.json(stats)
})

// Raw Prometheus passthrough for a specific chain (debugging)
app.get('/api/raw/:chainId', async (req, res) => {
  const chain = CHAIN_MAP.get(req.params.chainId)
  if (!chain) return res.status(404).json({ error: 'Unknown chain' })

  try {
    const axios = await import('axios')
    const response = await axios.default.get<string>(
      `http://localhost:${chain.metricsPort}/metrics`,
      { timeout: 5000, responseType: 'text' }
    )
    res.set('Content-Type', 'text/plain').send(response.data)
  } catch (e: any) {
    res.status(502).json({ error: e?.message ?? 'Failed to fetch metrics' })
  }
})

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n[rpc-stats-api] Listening on :${PORT}`)
  console.log(`[rpc-stats-api] Managing ${CHAINS.length} chain(s):`)
  CHAINS.forEach(c => console.log(`  • ${c.name} (${c.chainId}) → metrics :${c.metricsPort}`))
  console.log(`[rpc-stats-api] Scrape interval: ${SCRAPE_INTERVAL}ms\n`)
})

scrapeAll()
setInterval(scrapeAll, SCRAPE_INTERVAL)