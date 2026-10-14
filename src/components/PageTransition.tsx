import { useEffect, useLayoutEffect, useState, type ReactNode } from 'react'
import { animate, motion, useMotionValue, useReducedMotion, useTransform } from 'motion/react'
import { useNavigationType } from 'react-router-dom'
import WebMark from './WebMark'

// Route changes tear open through a web: one radius drives both the iris clip and the
// web's scale, so the web's rim is always the edge of the opening. The first page of a
// visit paints immediately (the intro or a plain load handles that moment).
let firstPage = true

export default function PageTransition({ title, children }: { title: string; children: ReactNode }) {
  const reduce = useReducedMotion()
  const navType = useNavigationType()
  // captured once, so StrictMode re-runs and HMR can't flip it mid-life
  const [isFirst] = useState(() => firstPage)
  const [opening, setOpening] = useState(() => !isFirst && !reduce)
  // The clip stays bound for the page's whole life and resolves to 'none' once fully open,
  // so nothing below the first screen can ever stay clipped.
  const r = useMotionValue(opening ? 4 : 150)
  const clip = useTransform(r, (v) => (v >= 150 ? 'none' : `circle(${v}vmax at 50vw 45vh)`))
  const webScale = useTransform(r, (v) => v / 20)
  const webOpacity = useTransform(r, [4, 100, 150], [1, 1, 0])

  // a new page starts at the top, before it paints; Back/Forward keep the browser's position
  useLayoutEffect(() => {
    if (!isFirst && navType !== 'POP') window.scrollTo({ top: 0, behavior: 'instant' })
  }, [isFirst, navType])

  useEffect(() => {
    document.title = title
  }, [title])

  useEffect(() => {
    firstPage = false
    if (!opening) return
    const controls = animate(r, 150, { duration: 0.45, ease: [0.2, 0.8, 0.2, 1], onComplete: () => setOpening(false) })
    return () => controls.stop()
  }, [opening, r])

  return (
    <>
      <motion.main id="main" tabIndex={-1} className="outline-none" style={{ clipPath: clip }} exit={{ opacity: 0, transition: { duration: 0 } }}>
        {children}
      </motion.main>
      {opening && (
        <div aria-hidden className="pointer-events-none fixed inset-0 z-[45] flex items-center justify-center">
          <motion.div style={{ scale: webScale, opacity: webOpacity }}>
            <WebMark className="h-[40vmax] w-[40vmax] text-paper" strokeWidth={0.6} />
          </motion.div>
        </div>
      )}
    </>
  )
}
