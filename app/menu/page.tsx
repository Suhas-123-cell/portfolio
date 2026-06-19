'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { CRTScreen } from '@/components/CRTScreen'

const MENU_ITEMS = [
  { label: 'ABOUT',    route: '/about',    hint: 'CHARACTER SELECT' },
  { label: 'PROJECTS', route: '/projects', hint: 'LEVEL SELECT'     },
  { label: 'SKILLS',   route: '/skills',   hint: 'STATS SCREEN'     },
  { label: 'CONTACT',  route: '/contact',  hint: 'TERMINAL'         },
]

const FLOATS = ['01', '10', '▓', '░', '◈', '⬡', '11', '00', '▒']

export default function MenuPage() {
  const router = useRouter()
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (['ArrowUp', 'ArrowDown', 'w', 'W', 's', 'S'].includes(e.key)) {
        e.preventDefault() // HIGH-3: stop arrow keys scrolling viewport
      }
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W')
        setSelected(prev => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length)
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S')
        setSelected(prev => (prev + 1) % MENU_ITEMS.length)
      else if (e.key === 'Enter' || e.key === ' ')
        router.push(MENU_ITEMS[selected].route)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, router])

  return (
    <CRTScreen>
      <div className="relative min-h-dvh flex flex-col items-center justify-center p-8 overflow-hidden" role="main">

        {FLOATS.map((glyph, i) => (
          <span key={i} className="absolute font-press-start select-none pointer-events-none"
            style={{
              left: `${5 + (i * 11) % 90}%`,
              top: `${8 + (i * 13) % 80}%`,
              fontSize: '10px',
              color: `oklch(35% 0.10 62 / ${0.2 + (i % 3) * 0.1})`,
              animation: `crt-flicker ${3 + (i % 4)}s ${i * 0.4}s infinite`,
            }}
            aria-hidden="true">
            {glyph}
          </span>
        ))}

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }} className="text-center">
          <div className="mb-2 font-press-start text-[10px] sm:text-xs tracking-widest"
            style={{ color: 'oklch(35% 0.10 62)' }}>PORTFOLIO v1.0</div>
          <h1 className="font-press-start text-xl sm:text-3xl mb-1 chromatic amber-glow"
            style={{ color: 'oklch(90% 0.12 80)' }}>SUHAS.EXE</h1>
          <div className="font-vt323 text-xl mb-12 tracking-widest"
            style={{ color: 'oklch(68% 0.15 198)' }}>AI ENGINEER &amp; FULL STACK DEV</div>
        </motion.div>

        {/* HIGH-2: sync selected on focus so Tab nav is visible */}
        <nav aria-label="Main navigation">
          <ul className="space-y-2 w-full max-w-sm">
            {MENU_ITEMS.map((item, i) => {
              const active = i === selected
              return (
                <motion.li key={item.route}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.07, duration: 0.4 }}>
                  <button
                    className="w-full flex items-center gap-4 px-6 py-3 font-press-start text-xs sm:text-sm text-left transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      color:                active ? 'oklch(90% 0.12 80)' : 'oklch(55% 0.155 65)',
                      background:           active ? 'oklch(10% 0.009 55)' : 'transparent',
                      border:               active ? '2px solid oklch(78% 0.17 72)' : '2px solid transparent',
                      boxShadow:            active ? '0 0 12px oklch(78% 0.17 72 / 0.3)' : 'none',
                      outlineColor:         'oklch(82% 0.18 198)',
                    }}
                    onMouseEnter={() => setSelected(i)}
                    onFocus={() => setSelected(i)}   // HIGH-2: Tab focus syncs selection
                    onClick={() => router.push(item.route)}
                    aria-pressed={active}
                  >
                    <span className={active ? 'blink' : ''}
                      style={{ color: 'oklch(68% 0.15 198)', opacity: active ? 1 : 0, minWidth: '1ch' }}>
                      ▶
                    </span>
                    <span>{item.label}</span>
                    {active && (
                      <span className="ml-auto font-vt323 text-sm tracking-widest"
                        style={{ color: 'oklch(35% 0.10 62)' }}>{item.hint}</span>
                    )}
                  </button>
                </motion.li>
              )
            })}
          </ul>
        </nav>

        <motion.div className="mt-12 font-vt323 text-base tracking-wide text-center"
          style={{ color: 'oklch(35% 0.10 62)' }}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}>
          ↑↓ / W S &nbsp;NAVIGATE &nbsp;·&nbsp; ENTER / CLICK &nbsp;SELECT
        </motion.div>
      </div>
    </CRTScreen>
  )
}
