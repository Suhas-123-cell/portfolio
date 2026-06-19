'use client'

import { createContext, useContext, useEffect, useState } from 'react'

type CRTCtx = { enabled: boolean; toggle: () => void }

const CRTContext = createContext<CRTCtx>({ enabled: true, toggle: () => {} })

export function CRTProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('crt-enabled')
    if (stored !== null) { setEnabled(stored === 'true'); return }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setEnabled(false)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--crt-scanline-opacity',  enabled ? '0.25' : '0')
    root.style.setProperty('--crt-flicker-intensity', enabled ? '0.04' : '0')
    root.style.setProperty('--crt-aberration-offset', enabled ? '1.5px' : '0px')
  }, [enabled])

  function toggle() {
    setEnabled(prev => {
      localStorage.setItem('crt-enabled', String(!prev))
      return !prev
    })
  }

  return <CRTContext.Provider value={{ enabled, toggle }}>{children}</CRTContext.Provider>
}

export const useCRT = () => useContext(CRTContext)
