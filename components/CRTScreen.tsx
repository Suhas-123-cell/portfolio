'use client'

import { useCRT } from '@/lib/crt-context'

export function CRTScreen({ children, className = '' }: {
  children: React.ReactNode
  className?: string
}) {
  const { enabled } = useCRT()

  return (
    <div
      className={`relative w-full min-h-dvh overflow-hidden ${className}`}
      style={{ borderRadius: enabled ? 'var(--crt-curvature)' : '0' }}
    >
      <div className={`relative z-10 w-full min-h-dvh ${enabled ? 'crt-flicker' : ''}`}>
        {children}
      </div>

      {enabled && (
        <>
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: `repeating-linear-gradient(
                to bottom,
                transparent 0px, transparent 2px,
                rgba(0,0,0,var(--crt-scanline-opacity)) 2px,
                rgba(0,0,0,var(--crt-scanline-opacity)) 4px
              )`,
            }}
          />
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: `radial-gradient(
                ellipse at center,
                transparent 50%,
                oklch(2% 0.003 55 / 0.65) 100%
              )`,
            }}
          />
          <div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              background: `radial-gradient(
                ellipse 80% 80% at center,
                oklch(78% 0.17 72 / 0.012) 0%,
                transparent 70%
              )`,
            }}
          />
        </>
      )}
    </div>
  )
}
