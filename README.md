# RydOne Public RPC

> Professional blockchain infrastructure & public RPC gateway — powered by provewithryd.xyz

A self-hosted RPC endpoint dashboard with live node metrics, real request tracking, and historical chart data. Built for validators who operate their own nodes and want a clean public-facing interface for their endpoints.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

**Live:** [endpoint.provewithryd.xyz](https://endpoint.provewithryd.xyz) · **Stats API:** [stats.provewithryd.xyz](https://stats.provewithryd.xyz)

---

## ✨ Features

- **Live node stats** — block height, block time, peers, memory, goroutines from Prometheus
- **Real request counters** — total requests read from nginx access logs (no mocks)
- **Live latency** — pings stats API server for accurate latency per chain
- **Historical charts** — hourly snapshots stored server-side, visualized as area charts
- **Multi-chain** — one backend manages all nodes; adding a chain = one config entry
- **EVM + Cosmos** — supports pure Cosmos SDK and EVM-compatible chains
- **Staking banner** — per-chain validator staking link with explorer integration
- **Daily load tester** — sends 50k requests/day per chain to maintain healthy traffic stats

---

## 🏗 Supported Networks

### Mainnet
| Chain | Chain ID | Type |
|-------|----------|------|
| Axone | `axone-1` | Cosmos |
| Dungeon | `dungeon-1` | Cosmos |
| Lumen | `lumen` | Cosmos |
| Regen | `regen-1` | Cosmos |
| Medas Digital | `medasdigital-2` | Cosmos |

### Testnet
| Chain | Chain ID | Type |
|-------|----------|------|
| Safrochain | `safro-test-1` | Cosmos |
| Empeiria | `empe-testnet-2` | Cosmos |
| Kiichain | `oro_1336-1` | Cosmos + EVM |
| Republic AI | `raitestnet_77701-1` | Cosmos + EVM |
| Pushchain | `push_42101-1` | Cosmos + EVM |

---

## 🗂 Project Structure

```
dashboard-endpoint/
├── rpc-gateway/                    # Frontend — React + TypeScript + Vite
│   ├── public/                     # Static assets
│   │   ├── logo.png                # Site logo (used in sidebar & footer)
│   │   ├── axone.png               # Chain logos
│   │   ├── dungeon.png
│   │   ├── lumen.png
│   │   ├── regen.png
│   │   ├── medas.png
│   │   ├── empeiria.png
│   │   ├── kiichain.png
│   │   ├── safrochain.jpg
│   │   ├── republicai.jpg
│   │   ├── pushchain.jpg
│   │   ├── website.png             # Social icons
│   │   ├── git.svg
│   │   ├── twit.svg
│   │   └── telegram.svg
│   ├── src/
│   │   ├── data/
│   │   │   └── index.ts            # ★ ALL network configs live here
│   │   ├── components/
│   │   │   ├── Avatar.tsx          # Chain icon — shows logo or initials fallback
│   │   │   ├── CopyButton.tsx      # Copy endpoint URL to clipboard
│   │   │   ├── CopyPeers.tsx       # Copy peers list helper
│   │   │   ├── EndpointCard.tsx    # RPC / WSS / gRPC / REST / EVM tabs
│   │   │   ├── RequestChart.tsx    # Recharts area chart (real or mock data)
│   │   │   ├── ChartTooltip.tsx    # Custom chart tooltip
│   │   │   ├── StakeBanner.tsx     # Validator staking CTA banner
│   │   │   ├── StatCard.tsx        # Individual metric card
│   │   │   └── Footer.tsx          # Site footer with network status summary
│   │   ├── pages/
│   │   │   ├── Sidebar.tsx         # Left sidebar — chain list, search, toggle
│   │   │   └── MainContent.tsx     # Main dashboard area
│   │   ├── hooks/
│   │   │   ├── useStore.ts         # Zustand global state (active chain, tab, range)
│   │   │   ├── useNodeStats.ts     # Polls GET /api/stats/:chainId every 10s
│   │   │   ├── useLatency.ts       # Pings /health for live latency measurement
│   │   │   ├── useLiveRps.ts       # Live req/sec with simulated jitter
│   │   │   ├── useChartData.ts     # Fetches GET /api/history/:chainId
│   │   │   └── useCopy.ts          # Clipboard utility hook
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── index.html
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── package.json
│
├── rpc-stats-api/                  # Backend — Express + TypeScript
│   ├── src/
│   │   ├── chains.ts               # ★ ALL chain configs live here
│   │   ├── index.ts                # Express server, routes, scrape scheduler
│   │   ├── stats.ts                # Combines Prometheus + nginx log + EVM data
│   │   ├── prometheus.ts           # Prometheus text format parser
│   │   ├── nginxlog.ts             # Nginx access log line counter
│   │   └── history.ts              # Hourly snapshot storage → /var/lib/rpc-stats/
│   ├── .env.example
│   ├── rpc-stats-api.service       # systemd unit (optional)
│   └── package.json
│
└── README.md
```

---

## ⚙️ Backend Setup (`rpc-stats-api`)

### 1. Enable Prometheus on Cosmos nodes

In `config/app.toml` for each node:
```toml
[telemetry]
enabled = true
prometheus-retention-time = 60
```

In `config/config.toml`:
```toml
[instrumentation]
prometheus = true
prometheus_listen_addr = ":10660"   # unique port per node
```

Restart node and verify:
```bash
curl http://localhost:10660/metrics | grep tendermint_consensus_height
```

### 2. Configure chains

Edit `rpc-stats-api/src/chains.ts`:

```typescript
export const CHAINS: ChainConfig[] = [
  {
    chainId:     'axone-1',
    name:        'Axone',
    metricsPort: 10660,     // Prometheus metrics port
    restPort:    10317,     // REST API port
    rpcPort:     10657,     // Tendermint RPC port
    testnet:     false,
    logFile:     '/var/log/nginx/axone.access.log',
    // For EVM chains, add:
    // evmPort: 52545,
    // wssPort: 52546,
  },
]
```

### 3. Set up nginx access logs

Run the provided script — it automatically adds `access_log` to all your nginx chain configs:

```bash
bash add-nginx-logs.sh
```

Creates per-chain log files at `/var/log/nginx/{chain}.access.log`.

### 4. Prevent log rotation

```bash
nano /etc/logrotate.d/nginx-chains
```

```
/var/log/nginx/axone.access.log
/var/log/nginx/dungeon.access.log
/var/log/nginx/lumen.access.log
/var/log/nginx/regen.access.log
/var/log/nginx/medas.access.log
/var/log/nginx/safrochain.access.log
/var/log/nginx/empeiria.access.log
/var/log/nginx/kiichain.access.log
/var/log/nginx/republic.access.log
/var/log/nginx/pushchain.access.log
{
    notifempty
    missingok
    size 100G
    rotate 0
    nocreate
}
```

Also update `/etc/logrotate.d/nginx` — replace wildcard with explicit files:
```nginx
# Before:
/var/log/nginx/*.log {

# After:
/var/log/nginx/access.log /var/log/nginx/error.log {
```

### 5. Install and run

```bash
cd rpc-stats-api
npm install
cp .env.example .env
nano .env
npm run build
pm2 start dist/index.js --name rpc-stats-api
pm2 save
```

`.env` options:
```env
PORT=3003
SCRAPE_INTERVAL=5000
ALLOWED_ORIGINS=*
HISTORY_FILE=/var/lib/rpc-stats/history.json
```

### 6. Create history storage directory

```bash
mkdir -p /var/lib/rpc-stats
```

### 7. Verify

```bash
curl https://stats.provewithryd.xyz/health
curl https://stats.provewithryd.xyz/api/stats/axone-1
curl "https://stats.provewithryd.xyz/api/history/axone-1?range=24h"
```

---

## 🌐 Frontend Setup (`rpc-gateway`)

### 1. Configure networks

Edit `rpc-gateway/src/data/index.ts` — **the only file you need to edit** to add or configure networks:

```typescript
const STATS_API = 'https://stats.provewithryd.xyz'

export const mainnetNetworks: Network[] = [
  {
    id: 1,
    title: 'Axone',
    symbol: 'AXONE',
    color: '#00d4ff',
    chainId: 'axone-1',
    statsApi: STATS_API,
    logo: '/axone.png',
    rpc:     'https://rpc-axone.provewithryd.xyz',
    wss:     '#',                           // '#' = tab disabled
    grpc:    'https://grpc-axone.provewithryd.xyz',
    grpcWeb: '#',
    rest:    'https://api-axone.provewithryd.xyz',
    evm:     '#',
    stake:   'https://explorer.provewithryd.xyz/axone-mainnet/staking/axonevaloper...',
    stats:   { total: '—', cached: '—', avgRps: '—', curRps: '—', blockTime: '—' },
  },
]
```

### 2. Add chain logos

Place logo images in `rpc-gateway/public/`:
```
public/
├── logo.png          # site logo
├── axone.png
├── dungeon.png
├── lumen.png
├── regen.png
├── medas.png
├── safrochain.jpg
├── empeiria.png
├── kiichain.png
├── republicai.jpg
└── pushchain.jpg
```

### 3. Build

```bash
cd rpc-gateway
npm install
npm run build
# Output → dist/
```

---

## 🚢 Deployment

### Backend — PM2

```bash
cd rpc-stats-api
npm run build
pm2 start dist/index.js --name rpc-stats-api
pm2 save
pm2 startup    # auto-start on reboot
```

### Frontend — Nginx static serving

```nginx
# /etc/nginx/sites-available/rpc-gateway.conf

server {
    listen 80;
    server_name endpoint.provewithryd.xyz;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name endpoint.provewithryd.xyz;

    ssl_certificate /etc/letsencrypt/live/provewithryd.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/provewithryd.xyz/privkey.pem;

    root /var/www/dashboard-endpoint/rpc-gateway/dist;
    index index.html;

    # SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Cache static assets
    location ~* \.(js|css|png|svg|jpg|ico|woff2)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

```bash
ln -s /etc/nginx/sites-available/rpc-gateway.conf /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d endpoint.provewithryd.xyz
```

### Stats API — Nginx reverse proxy

```nginx
# /etc/nginx/sites-available/stats.conf

server {
    listen 443 ssl http2;
    server_name stats.provewithryd.xyz;

    ssl_certificate /etc/letsencrypt/live/provewithryd.xyz/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/provewithryd.xyz/privkey.pem;

    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
    }
}
```

```bash
ln -s /etc/nginx/sites-available/stats.conf /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
```

### Deploy frontend updates

```bash
cd rpc-gateway
npm run build
# nginx serves dist/ automatically — no restart needed
```

---

## 🔗 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/health` | GET | API health check + all chain status |
| `/api/stats` | GET | All chains live stats |
| `/api/stats/:chainId` | GET | Single chain live stats |
| `/api/history/:chainId?range=24h\|7d\|30d` | GET | Historical data for chart |
| `/api/raw/:chainId` | GET | Raw Prometheus metrics (debug) |

### Example — `GET /api/stats/axone-1`

```json
{
  "chainId": "axone-1",
  "name": "Axone",
  "testnet": false,
  "hasEvm": false,
  "hasWss": false,
  "latestBlockHeight": 3831560,
  "blockTime": 5.66,
  "syncing": false,
  "totalRequests": 48291,
  "cachedPct": 0,
  "avgRps": 1,
  "curRps": 2,
  "numPeers": 9,
  "memUsageMB": 376.1,
  "goRoutines": 186,
  "scrapeOk": true,
  "timestamp": 1773777020432
}
```

### Example — `GET /api/stats/oro_1336-1` (EVM chain)

```json
{
  "chainId": "oro_1336-1",
  "name": "Kiichain",
  "hasEvm": true,
  "hasWss": true,
  "latestBlockHeight": 29554258,
  "evmBlockNumber": 29554257,
  "evmChainId": "1336",
  "blockTime": 2.78,
  "numPeers": 21,
  "scrapeOk": true
}
```

---

## ➕ Adding a New Chain

**1.** Add entry to `rpc-stats-api/src/chains.ts`

**2.** Create nginx proxy configs for rpc/api/grpc endpoints with `access_log /var/log/nginx/{chain}.access.log;`

**3.** Add entry to `rpc-gateway/src/data/index.ts`

**4.** Add log file to `/etc/logrotate.d/nginx-chains`

**5.** Rebuild and restart:
```bash
# Backend
cd rpc-stats-api && npm run build && pm2 restart rpc-stats-api

# Frontend
cd rpc-gateway && npm run build
```

No other files need to change.

---

## 🛠 Tech Stack

| Layer | Stack |
|-------|-------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS, Recharts, Zustand |
| Backend | Node.js, Express, TypeScript |
| Metrics source | Prometheus (Cosmos SDK built-in telemetry) |
| Traffic tracking | Nginx access logs |
| History storage | JSON file (`/var/lib/rpc-stats/history.json`) |
| Process manager | PM2 |
| Web server | Nginx |
| SSL | Let's Encrypt / Certbot |

---

## 📄 License

MIT © 2026 [@RydOne](https://provewithryd.xyz)