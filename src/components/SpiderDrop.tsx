import { useEffect, useRef, useState } from 'react'
import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from 'motion/react'
import { SPIDER_LEGS } from '../lib/spider'

// A spider rides its dragline down the right edge as you scroll, swinging when you
// scroll fast. Hold and drag it along the line to scroll the page up and down; a plain
// click sends it back to the top. Hidden on pages too short to scroll.

const TOP = 66 // just below the header border
const REST = 0.02 // spider's top-of-page position, as a fraction of the viewport height
const SPAN = 0.72 // how much of the viewport height the line covers from top to bottom of the page

function Spider() {
  return (
    <svg viewBox="-20 -16 40 36" className="h-9 w-9" aria-hidden>
      <g fill="none" stroke="var(--paper)" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
        {SPIDER_LEGS.map((d) => (
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
  const [dragging, setDragging] = useState(false)
  const drag = useRef<{ grab: number; startY: number; moved: boolean } | null>(null)
  const dragged = useRef(false) // swallows the click that follows a drag
  const { scrollYProgress, scrollY } = useScroll()
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 18, mass: 0.5 })

  // transforms only: the line scales from the top, the spider translates
  const y = useTransform(p, (v) => (REST + SPAN * v) * window.innerHeight)
  const lineScale = useTransform(y, (v) => v / Math.max(1, window.innerHeight - TOP))
  const swing = useSpring(useTransform(useVelocity(scrollY), [-2500, 0, 2500], [14, 0, -14]), { stiffness: 120, damping: 8 })

  useEffect(() => {
    const check = () => setScrollable(document.documentElement.scrollHeight > window.innerHeight * 1.1)
    const ro = new ResizeObserver(check)
    ro.observe(document.body)
    check()
    return () => ro.disconnect()
  }, [])

  // the inverse of `y`: put the page where the spider would sit under the pointer
  const scrollToPointer = (clientY: number, grab: number) => {
    const vh = window.innerHeight
    const v = ((clientY - grab - TOP) / vh - REST) / SPAN
    const max = document.documentElement.scrollHeight - vh
    window.scrollTo({ top: Math.min(1, Math.max(0, v)) * max, behavior: 'instant' }) // instant: html is scroll-behavior: smooth
  }

  const endDrag = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!drag.current) return
    dragged.current = drag.current.moved
    drag.current = null
    setDragging(false)
    if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId)
  }

  if (!scrollable) return null

  return (
    <div className="pointer-events-none fixed bottom-0 right-5 z-40 hidden w-10 lg:block" style={{ top: TOP }}>
      <motion.div aria-hidden className="absolute left-1/2 top-0 h-full w-px origin-top bg-paper/70" style={{ scaleY: lineScale }} />
      <motion.div className="absolute left-1/2 top-0 -ml-[18px]" style={{ y }}>
        <motion.button
          type="button"
          aria-label="Back to top (drag to scroll)"
          title="Drag to scroll, click for top"
          onClick={() => {
            if (dragged.current) {
              dragged.current = false
              return
            }
            window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
          }}
          onPointerDown={(e) => {
            if (e.button !== 0) return
            e.currentTarget.setPointerCapture(e.pointerId)
            drag.current = { grab: e.clientY - (TOP + y.get()), startY: e.clientY, moved: false }
            dragged.current = false
            setDragging(true)
          }}
          onPointerMove={(e) => {
            const d = drag.current
            if (!d) return
            if (!d.moved && Math.abs(e.clientY - d.startY) > 4) d.moved = true
            if (d.moved) scrollToPointer(e.clientY, d.grab)
          }}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="pointer-events-auto block origin-top touch-none select-none transition-transform hover:scale-110"
          style={{ rotate: reduce ? 0 : swing, cursor: dragging ? 'grabbing' : 'grab' }}
        >
          <Spider />
        </motion.button>
      </motion.div>
    </div>
  )
}
