import { useMemo } from 'react'

// Decides how heavy the 3D scene is allowed to be.
export function useDeviceTier() {
  return useMemo(() => {
    if (typeof window === 'undefined') return 'high'

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return 'static'

    const coarse = window.matchMedia('(pointer: coarse)').matches
    const narrow = window.innerWidth < 900
    const cores = navigator.hardwareConcurrency || 4
    const memory = navigator.deviceMemory || 4

    if (coarse || narrow || cores <= 4 || memory <= 4) return 'low'
    return 'high'
  }, [])
}

export const TIER_SETTINGS = {
  high: { panels: 7, agents: 5, particles: 260, dpr: [1, 1.8], shadows: true },
  low: { panels: 4, agents: 3, particles: 90, dpr: [1, 1.3], shadows: false },
  static: { panels: 4, agents: 3, particles: 0, dpr: [1, 1.3], shadows: false },
}
