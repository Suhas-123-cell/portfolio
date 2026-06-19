'use client'

import { useCRT } from '@/lib/crt-context'

export function CRTToggle() {
  const { enabled, toggle } = useCRT()
  return (
    <button
      onClick={toggle}
      className="font-press-start text-[8px] px-2 py-1 border border-current transition-all hover:opacity-80"
      style={{ color: enabled ? 'oklch(68% 0.15 198)' : 'oklch(55% 0.155 65)' }}
      aria-label={`CRT effects ${enabled ? 'on' : 'off'}, click to toggle`}
    >
      CRT:{enabled ? 'ON' : 'OFF'}
    </button>
  )
}
