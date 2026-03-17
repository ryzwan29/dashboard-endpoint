# RPC Gateway Dashboard

A modern, fully static RPC endpoint dashboard for multiple blockchain networks — inspired by Alchemy/Infura but lightweight and open.

## Tech Stack

- React 18 + TypeScript
- Vite
- TailwindCSS
- Zustand (state management)
- Chart.js + react-chartjs-2

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── data/
│   └── index.ts          ← ALL network configs live here
├── components/
│   ├── Sidebar.tsx        ← Network list + search + toggle
│   ├── EndpointCard.tsx   ← Tabs + URL display + copy button
│   ├── StatsGrid.tsx      ← 5 stat cards + time range toggle
│   └── RequestChart.tsx   ← Chart.js line chart
├── pages/
│   └── DashboardPage.tsx  ← Main content layout
├── hooks/
│   ├── useGatewayStore.ts ← Zustand store (global state)
│   ├── useChartData.ts    ← Deterministic chart data generator
│   └── useLiveRps.ts      ← Live req/sec ticker (simulated)
├── App.tsx
├── main.tsx
└── index.css
```

## Adding a New Network

**Only edit `src/data/index.ts`** — no other file needs to change.

Add an object to `mainnetNetworks` or `testnetNetworks`:

```ts
{
  id: 200,                          // unique number
  title: 'MyChain',
  chainId: 'mychain-1',
  ticker: 'MYC',
  color: '#ff6b35',                 // accent color for the icon
  status: 'online',                 // 'online' | 'degraded' | 'offline'
  latency: 45,                      // ms, affects latency badge color
  rpc:     'https://mychain-rpc.example.com',
  wss:     'wss://mychain-rpc.example.com',
  grpc:    'https://mychain-grpc.example.com',
  grpcWeb: '#',                     // use '#' = tab disabled
  rest:    'https://mychain-rest.example.com',
  evm:     '#',                     // '#' = no MetaMask button
  blockTime: 6.0,
  totalReqs: 5000000,
  cachedPct: 45.0,
  avgRps: 58,
  curRps: 55,
}
```

That's it. The sidebar, tabs, stats, and chart all update automatically.

## Features

- **Sidebar** — searchable network list, Mainnet/Testnet toggle, status dots
- **Endpoint tabs** — RPC, WS RPC, gRPC, gRPC-Web, REST, EVM (auto-disabled if `"#"`)
- **Copy button** — copies endpoint to clipboard with feedback
- **MetaMask button** — `wallet_addEthereumChain` for EVM networks
- **Stats cards** — Total Requests, Cached %, Avg req/sec, Live req/sec, Block Time
- **Time range** — 24h / 7d / 30d toggle
- **Live req/sec** — simulated jitter ticker every 3s
- **Latency badge** — green (<40ms) / yellow (<80ms) / red (≥80ms)
- **Responsive** — desktop-first, collapses gracefully on smaller screens

## Real Latency (Live Ping)

Latency is measured in real-time directly from the browser — no backend needed.

**How it works:**
- On network select → immediately sends a ping to the RPC endpoint
- Re-pings every **15 seconds** automatically
- For EVM chains: sends `eth_blockNumber` JSON-RPC call (tiny payload)
- For Cosmos/non-EVM chains: hits the `/cosmos/base/tendermint/v1beta1/node_info` REST endpoint
- Timeout after **8 seconds** → marks as Offline

**LatencyBadge colors:**
| Range | Color |
|-------|-------|
| < 100ms | Green |
| 100–300ms | Yellow |
| > 300ms | Red |
| Unreachable | Red / Offline |

**Sparkline** — the badge shows a mini SVG sparkline of the last 20 ping measurements.

**Note on CORS:** Some RPC endpoints may block browser fetch due to CORS policy.
In that case the ping will fail and show "Offline" even if the endpoint is up.
This is a browser security limitation — the endpoint still works for your dApp.
