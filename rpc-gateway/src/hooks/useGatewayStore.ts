import { create } from 'zustand'
import {
  Network,
  TabKey,
  TimeRange,
  mainnetNetworks,
  testnetNetworks,
} from '../data'

type NetType = 'mainnet' | 'testnet'

interface GatewayState {
  activeNetwork: Network
  netType: NetType
  activeTab: TabKey
  timeRange: TimeRange
  searchQuery: string
  // Actions
  selectNetwork: (id: number) => void
  setNetType: (type: NetType) => void
  setActiveTab: (tab: TabKey) => void
  setTimeRange: (range: TimeRange) => void
  setSearchQuery: (q: string) => void
  getFilteredNetworks: () => Network[]
}

export const useGatewayStore = create<GatewayState>((set, get) => ({
  activeNetwork: mainnetNetworks[0],
  netType: 'mainnet',
  activeTab: 'rpc',
  timeRange: '24h',
  searchQuery: '',

  selectNetwork: (id) => {
    const all = [...mainnetNetworks, ...testnetNetworks]
    const n = all.find((x) => x.id === id)
    if (n) set({ activeNetwork: n, activeTab: 'rpc' })
  },

  setNetType: (type) => {
    const list = type === 'mainnet' ? mainnetNetworks : testnetNetworks
    set({ netType: type, activeNetwork: list[0], activeTab: 'rpc', searchQuery: '' })
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setTimeRange: (range) => set({ timeRange: range }),

  setSearchQuery: (q) => set({ searchQuery: q }),

  getFilteredNetworks: () => {
    const { netType, searchQuery } = get()
    const list = netType === 'mainnet' ? mainnetNetworks : testnetNetworks
    if (!searchQuery.trim()) return list
    return list.filter((n) =>
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.ticker.toLowerCase().includes(searchQuery.toLowerCase())
    )
  },
}))
