import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'

// A spider rides its dragline down the right edge as you scroll, swinging when you
// scroll fast. Click it and it climbs back to the top. Hidden on pages too short to scroll.

const TOP = 66 // just below the header border

function Spider() {
  const legs = [
    'M-4 -3 L-11 -10 L-15 -4',
    'M-4 -1 L-13 -4 L-17 2',
    'M-4 1 L-12 4 L-15 11',
    'M-4 3 L-9 9 L-10 16',
  ]
  return (
    <svg viewBox="-20 -16 40 36" className="h-9 w-9" aria-hidden>
      <g fill="none" stroke="var(--paper)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        {legs.map((d) => (
          <g key={d}>
            <path d={d} />
            <path d={d} transform="scale(-1 1)" />
          </g>
        ))}
      </g>
      <ellipse cx="0" cy="5" rx="5.2" ry="7" fill="var(--hero)" stroke="var(--paper)" strokeWidth={1.4} />
      <circle cx="0" cy="-4" r="3.6" fill="var(--hero)" stroke="var(--paper)" strokeWidth={1.4} />
    </svg>
  )
}

export default function SpiderDrop() {
  const reduce = useReducedMotion()
  const [scrollable, setScrollable] = useState(false)
  const { scrollYProgress, scrollY } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 18, mass: 0.5 })

  // transforms only: the line scales from the top, the spider translates
  const y = useTransform(p, (v) => (0.02 + 0.72 * v) * window.innerHeight)
  const lineScale = useTransform(y, (v) => v / Math.max(1, window.innerHeight - TOP))
  const swing = useSpring(useTransform(useVelocity(scrollY), [-2500, 0, 2500], [14, 0, -14]), { stiffness: 120, damping: 8 })

  useEffect(() => {
    const check = () => setScrollable(document.documentElement.scrollHeight > window.innerHeight * 1.1)
    const ro = new ResizeObserver(check)
    ro.observe(document.body)
    check()
    return () => ro.disconnect()
  }, [])

  if (!scrollable) return null

  return (
    <div className="pointer-events-none fixed bottom-0 right-5 z-40 hidden w-10 lg:block" style={{ top: TOP }}>
      <motion.div aria-hidden className="absolute left-1/2 top-0 h-full w-px origin-top bg-paper/70" style={{ scaleY: lineScale }} />
      <motion.div className="absolute left-1/2 top-0 -ml-[18px]" style={{ y }}>
        <motion.button
          type="button"
          aria-label="Back to top"
          title="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })}
          className="pointer-events-auto block origin-top transition-transform hover:scale-110"
          style={{ rotate: reduce ? 0 : swing }}
        >
          <Spider />
        </motion.button>
      </motion.div>
    </div>
  )
}
