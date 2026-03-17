import { useState, useEffect } from 'react'

export function useLiveRps(curRps: number): number {
  const [rps, setRps] = useState(curRps)

  useEffect(() => {
    setRps(curRps)
    const interval = setInterval(() => {
      const jitter = Math.round((Math.random() - 0.5) * Math.max(curRps, 10) * 0.06)
      setRps(curRps + jitter)
    }, 3000)
    return () => clearInterval(interval)
  }, [curRps])

  return rps
}
