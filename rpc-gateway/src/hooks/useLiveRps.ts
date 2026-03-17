import { useState, useEffect } from 'react'
import { Network } from '../data'

export function useLiveRps(network: Network): number {
  const [rps, setRps] = useState(network.curRps)

  useEffect(() => {
    setRps(network.curRps)
    const interval = setInterval(() => {
      const jitter = Math.round((Math.random() - 0.5) * network.curRps * 0.06)
      setRps(network.curRps + jitter)
    }, 3000)
    return () => clearInterval(interval)
  }, [network.id, network.curRps])

  return rps
}
