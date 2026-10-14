import { useEffect, useRef, useState } from 'react'
import { createHeroScene, type HeroScene } from './scene'

/**
 * Spider-Verse hero backdrop: night skyline, a live orb web in the top-left, comic-print post.
 * Fills its (position:relative) parent. Decorative only: aria-hidden, pointer-events:none.
 * Renders nothing if WebGL is unavailable.
 */
export default function WebHero({ className }: { className?: string }) {
  const hostRef = useRef<HTMLDivElement>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    // The canvas is created per mount so its GL context can be released on unmount
    // (StrictMode mounts twice; reusing one canvas after forceContextLoss would break).
    const canvas = document.createElement('canvas')
    canvas.setAttribute('aria-hidden', 'true')
    canvas.style.cssText =
      'position:absolute;inset:0;width:100%;height:100%;display:block;pointer-events:none;opacity:0;transition:opacity .45s ease-out'
    host.appendChild(canvas)

    let hero: HeroScene
    try {
      hero = createHeroScene(canvas)
    } catch {
      canvas.remove()
      setFailed(true)
      return
    }

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    let reduced = motionQuery.matches
    let onScreen = true
    let raf = 0
    let last = 0
    let frames = 0
    let lost = false
    // phones: cap at 30 fps (half the work, steadier than a stuttering 60)
    const minFrame = window.matchMedia('(max-width: 767px)').matches ? 1000 / 30 - 4 : 0

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop)
      if (last && now - last < minFrame) return
      const dt = last ? Math.min((now - last) / 1000, 0.1) : 1 / 60
      last = now
      hero.frame(dt, true)
      if (!shown) show()
      if (import.meta.env.DEV && ++frames % 60 === 0) canvas.dataset.ms = hero.stats.ms.toFixed(2)
    }

    // fade the first rendered frame in over the CSS sky instead of popping
    let shown = false
    const show = () => {
      shown = true
      canvas.style.opacity = '1'
    }
    const renderStill = () => {
      if (lost) return
      hero.frame(0, false)
      if (!shown) show()
    }

    const sync = () => {
      const run = onScreen && !document.hidden && !reduced && !lost
      if (run && !raf) {
        last = 0
        raf = requestAnimationFrame(loop)
      } else if (!run && raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
      if (reduced) renderStill()
    }

    const sizeTarget = host.parentElement ?? host
    // canvas rect cached here and on scroll, so pointermove never forces layout
    let rect = canvas.getBoundingClientRect()
    const measure = () => {
      rect = canvas.getBoundingClientRect()
    }
    const resize = () => {
      const r = sizeTarget.getBoundingClientRect()
      hero.resize(r.width, r.height)
      measure()
      // a still frame is only needed when nothing animates (reduced motion); otherwise the loop
      // paints the next frame, and an early still would skip the load crane-up
      if (!raf && reduced) renderStill()
    }
    const ro = new ResizeObserver(resize)
    ro.observe(sizeTarget)
    resize()

    const io = new IntersectionObserver((entries) => {
      onScreen = entries.some((e) => e.isIntersecting)
      sync()
    })
    io.observe(host)

    const toNdc = (e: PointerEvent) => {
      const r = rect
      const x = ((e.clientX - r.left) / r.width) * 2 - 1
      const y = -(((e.clientY - r.top) / r.height) * 2 - 1)
      return { x, y, inside: Math.abs(x) <= 1 && Math.abs(y) <= 1 }
    }
    const onMove = (e: PointerEvent) => {
      if (reduced || !raf) return
      const p = toNdc(e)
      hero.pointerMove(p.x, p.y, p.inside)
    }
    const onDown = (e: PointerEvent) => {
      if (reduced || !raf) return
      const p = toNdc(e)
      if (p.inside) hero.pointerDown(p.x, p.y)
    }
    const onOut = (e: PointerEvent) => {
      if (!e.relatedTarget) hero.pointerMove(0, 0, false)
    }
    const onSuit = () => {
      if (raf) hero.suitChange()
      else {
        hero.applyTheme()
        renderStill()
      }
    }
    const onMotion = () => {
      reduced = motionQuery.matches
      if (reduced) hero.pointerMove(0, 0, false)
      sync()
    }
    const onLost = (e: Event) => {
      e.preventDefault()
      lost = true
      sync()
    }
    const onRestored = () => {
      lost = false
      sync()
    }

    window.addEventListener('scroll', measure, { passive: true })
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerdown', onDown, { passive: true })
    window.addEventListener('pointerout', onOut, { passive: true })
    window.addEventListener('suitchange', onSuit)
    document.addEventListener('visibilitychange', sync)
    motionQuery.addEventListener('change', onMotion)
    canvas.addEventListener('webglcontextlost', onLost)
    canvas.addEventListener('webglcontextrestored', onRestored)
    sync()

    return () => {
      cancelAnimationFrame(raf)
      raf = 0
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('scroll', measure)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointerout', onOut)
      window.removeEventListener('suitchange', onSuit)
      document.removeEventListener('visibilitychange', sync)
      motionQuery.removeEventListener('change', onMotion)
      canvas.removeEventListener('webglcontextlost', onLost)
      canvas.removeEventListener('webglcontextrestored', onRestored)
      hero.dispose()
      canvas.remove()
    }
  }, [])

  if (failed) return null
  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className={className}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'none' }}
    />
  )
}
