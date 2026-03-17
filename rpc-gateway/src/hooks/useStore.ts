import { create } from 'zustand'
import { Network, mainnetNetworks, testnetNetworks } from '../data'

export type NetworkMode = 'mainnet' | 'testnet'
export type TabKey = 'rpc' | 'wss' | 'grpc' | 'grpcWeb' | 'rest' | 'evm'
export type ChartRange = '24h' | '7d' | '30d'

interface DashboardState {
  mode: NetworkMode
  activeId: number
  search: string
  tab: TabKey
  chartRange: ChartRange
  networks: Network[]
  activeNetwork: Network
  setMode: (mode: NetworkMode) => void
  setActiveId: (id: number) => void
  setSearch: (q: string) => void
  setTab: (tab: TabKey) => void
  setChartRange: (range: ChartRange) => void
}

function getNetworks(mode: NetworkMode) {
  return mode === 'mainnet' ? mainnetNetworks : testnetNetworks
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  mode: 'mainnet',
  activeId: 1,
  search: '',
  tab: 'rpc',
  chartRange: '24h',
  networks: mainnetNetworks,
  activeNetwork: mainnetNetworks[0],

  setMode: (mode) => {
    const networks = getNetworks(mode)
    set({ mode, networks, activeId: 1, activeNetwork: networks[0], tab: 'rpc' })
  },

  setActiveId: (id) => {
    const networks = get().networks
    const activeNetwork = networks.find((n) => n.id === id) ?? networks[0]
    set({ activeId: id, activeNetwork, tab: 'rpc' })
  },

  setSearch: (search) => set({ search }),
  setTab: (tab) => set({ tab }),
  setChartRange: (chartRange) => set({ chartRange }),
}))
