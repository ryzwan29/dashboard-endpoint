# rpc-stats-api

Lightweight Express + TypeScript stats API for the RPC Gateway dashboard.
Scrapes your Cosmos node's Prometheus metrics and exposes them via a simple REST endpoint.

## Setup

```bash
npm install
cp .env.example .env
# edit .env with your node's details
npm run dev         # development (hot reload)
npm run build && npm start   # production
```

## First: Enable Prometheus on your Cosmos node

In your node's `config/app.toml`:
```toml
[telemetry]
enabled = true
prometheus-retention-time = 60

[api]
enable = true
```

In `config/config.toml`:
```toml
[instrumentation]
prometheus = true
prometheus_listen_addr = ":26660"
```

Restart your node, then verify:
```bash
curl http://localhost:26660/metrics | head -50
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3001` | Port to listen on |
| `PROMETHEUS_URL` | `http://localhost:26660/metrics` | Your node's Prometheus endpoint |
| `NODE_REST_URL` | `http://localhost:1317` | Your node's REST API |
| `SCRAPE_INTERVAL` | `5000` | How often to scrape (ms) |
| `CHAIN_ID` | `unknown` | Your chain ID |
| `NODE_MONIKER` | `my-node` | Your node name |
| `ALLOWED_ORIGINS` | `*` | CORS origins (set to your domain in prod) |

## Endpoints

- `GET /health` — API health check
- `GET /api/stats` — Main stats (what the frontend polls)
- `GET /api/raw` — Raw Prometheus metrics passthrough (for debugging)

## Run as systemd service (production)

```bash
npm run build

sudo cp rpc-stats-api.service /etc/systemd/system/
# Edit the service file to match your user/path
sudo systemctl daemon-reload
sudo systemctl enable rpc-stats-api
sudo systemctl start rpc-stats-api
sudo systemctl status rpc-stats-api
```

## Connect to dashboard

In your dashboard's `src/data/index.ts`, add `statsApi` to your network:

```ts
{
  id: 11,
  title: 'Axone',
  chainId: 'axone-1',
  statsApi: 'https://stats.yourdomain.com',   // ← add this
  rpc: 'https://axone-rpc.publicnode.com',
  // ... rest of config
}
```

The dashboard will automatically switch from mock data to live data for that network.

## Metric Names Reference (Cosmos SDK / CometBFT)

| Metric | Description |
|--------|-------------|
| `tendermint_consensus_height` | Latest block height |
| `cometbft_consensus_height` | Same (newer CometBFT naming) |
| `tendermint_consensus_block_interval_seconds_*` | Block time summary |
| `tendermint_p2p_peers` | Connected peers |
| `tendermint_rpc_request_duration_seconds_count` | Total RPC requests |
| `go_goroutines` | Active goroutines |
| `go_memstats_alloc_bytes` | Memory usage |
| `process_resident_memory_bytes` | RSS memory |
