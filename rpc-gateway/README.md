# ⚡ NodeGate — RPC Gateway Dashboard

A modern, fully-static RPC endpoint dashboard for multiple blockchain networks.
Inspired by Alchemy / Infura — built lightweight with zero backend.

## Tech Stack

- **React 18** + **TypeScript**
- **Vite** (build tool)
- **TailwindCSS** (utility classes)
- **Zustand** (global state)
- **Recharts** (area chart)

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
│   └── index.ts          ← ALL network configs here (one source of truth)
├── components/
│   ├── Avatar.tsx         ← Network icon badge
│   ├── CopyButton.tsx     ← Clipboard copy button
│   ├── StatCard.tsx       ← Stats metric card
│   ├── ChartTooltip.tsx   ← Recharts custom tooltip
│   ├── EndpointCard.tsx   ← Tabbed endpoint display
│   └── RequestChart.tsx   ← Area chart with range toggle
├── pages/
│   ├── Sidebar.tsx        ← Left nav: search, mode toggle, network list
│   └── MainContent.tsx    ← Header, endpoint card, stats, chart
├── hooks/
│   ├── useStore.ts        ← Zustand store (mode, activeNetwork, tab, range)
│   ├── useChartData.ts    ← Seeded mock chart data generator
│   └── useCopy.ts         ← Clipboard hook with copied feedback
├── App.tsx                ← Root layout
├── main.tsx               ← Entry point
└── index.css              ← Tailwind base + global styles
```

## Adding a New Network

Open `src/data/index.ts` and push one object into `mainnetNetworks` or `testnetNetworks`:

```ts
{
  id: 13,                          // must be unique within the array
  title: 'My Network',
  symbol: 'MYN',
  color: '#FF6B6B',                // brand hex color
  rpc:     'https://my-rpc.example.com',
  wss:     'wss://my-rpc.example.com',
  rest:    'https://my-rest.example.com',
  grpc:    'my-grpc.example.com:443',
  grpcWeb: 'https://my-grpc.example.com',
  evm:     '#',                    // '#' = disabled tab
  stats: {
    total:     '1,000,000',
    cached:    '50.00',
    avgRps:    '1,000',
    curRps:    '900',
    blockTime: '5.00s',
  },
}
```

That's it — the sidebar, endpoint card, and stats all update automatically.

## Features

- 🌐 12 mainnet + 5 testnet networks out of the box
- 🔍 Sidebar search filter
- 🔀 Mainnet / Testnet toggle
- 📋 One-click endpoint copy (RPC, WS, gRPC, gRPC-Web, REST, EVM)
- ⚠️ Auto-disabled tabs when endpoint is `"#"`
- 📊 Area chart with 24h / 7d / 30d range
- 🎨 Dark theme with blue grid overlay + glassmorphism cards
- ⚡ Status, latency, and block time badges
