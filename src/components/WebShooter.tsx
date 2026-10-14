import { useEffect, useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

// Click any empty spot on the page and a web line fires from the edge of the
// screen (your wrist) and splats where you clicked. THWIP.

type Shot = { id: number; x0: number; y0: number; x1: number; y1: number; tilt: number }

const IGNORE = 'a, button, input, textarea, select, label, summary, [role="button"], [role="dialog"], [data-no-web]'
let nextId = 0

function Splat() {
  const spokes = Array.from({ length: 9 }, (_, i) => {
    const a = (i / 9) * Math.PI * 2 + 0.3
    const r = 16 + ((i * 7) % 5) * 2.4
    return `M0 0 L${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`
  }).join(' ')
  const ring = (r: number) =>
    Array.from({ length: 10 }, (_, i) => {
      const a = (i / 9) * Math.PI * 2 + 0.3
      return `${i ? 'L' : 'M'}${(Math.cos(a) * r).toFixed(1)} ${(Math.sin(a) * r).toFixed(1)}`
    }).join(' ')
  return (
    <path
      d={`${spokes} ${ring(7)} ${ring(13)}`}
      fill="none"
      stroke="var(--paper)"
      strokeWidth={1.6}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  )
}

export default function WebShooter() {
  const reduce = useReducedMotion()
  const [shots, setShots] = useState<Shot[]>([])

  useEffect(() => {
    if (reduce) return
    const timers = new Set<number>()
    const onClick = (e: MouseEvent) => {
      if (e.button !== 0) return
      // composedPath is captured before React re-renders (e.g. the menu icon swapping),
      // so taps on UI never fire a web even if the target node gets replaced.
      const hitUi = e.composedPath().some((n) => n instanceof Element && n.matches(IGNORE))
      if (hitUi) return
      if (window.getSelection()?.isCollapsed === false) return
      const fromLeft = e.clientX < window.innerWidth / 2
      const shot: Shot = {
        id: nextId++,
        x0: fromLeft ? -12 : window.innerWidth + 12,
        y0: window.innerHeight * 0.95,
        x1: e.clientX,
        y1: e.clientY,
        tilt: Math.random() * 24 - 12,
      }
      setShots((s) => [...s.slice(-4), shot])
      const t = window.setTimeout(() => {
        timers.delete(t)
        setShots((s) => s.filter((x) => x.id !== shot.id))
      }, 1300)
      timers.add(t)
    }
    window.addEventListener('click', onClick, true)
    return () => {
      window.removeEventListener('click', onClick, true)
      timers.forEach((t) => window.clearTimeout(t))
    }
  }, [reduce])

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[55] overflow-hidden">
      <svg className="absolute inset-0 h-full w-full">
        <AnimatePresence>
          {shots.map((s) => (
            <motion.g key={s.id} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
              <motion.line
                x1={s.x0}
                y1={s.y0}
                x2={s.x1}
                y2={s.y1}
                stroke="var(--paper)"
                strokeWidth={2.4}
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.13, ease: 'easeOut' }}
              />
              <g transform={`translate(${s.x1} ${s.y1})`}>
                <motion.g
                  initial={{ scale: 0, rotate: s.tilt }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.11, type: 'spring', stiffness: 520, damping: 16 }}
                >
                  <Splat />
                </motion.g>
              </g>
            </motion.g>
          ))}
        </AnimatePresence>
      </svg>
      <AnimatePresence>
        {shots.map((s) => (
          <motion.span
            key={s.id}
            className="sfx absolute text-3xl"
            style={{ left: s.x1 + 14, top: s.y1 - 52, rotate: s.tilt }}
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ delay: 0.08, type: 'spring', stiffness: 600, damping: 14 }}
          >
            THWIP!
          </motion.span>
        ))}
      </AnimatePresence>
    </div>
  )
}
