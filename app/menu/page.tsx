'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CRTScreen } from '@/components/CRTScreen'

const MENU_ITEMS = [
  { label: 'ABOUT',    route: '/about',    hint: 'CHARACTER SELECT' },
  { label: 'PROJECTS', route: '/projects', hint: 'LEVEL SELECT'     },
  { label: 'SKILLS',   route: '/skills',   hint: 'STATS SCREEN'     },
  { label: 'CONTACT',  route: '/contact',  hint: 'TERMINAL'         },
]

export default function MenuPage() {
  const router = useRouter()
  const [selected, setSelected] = useState(0)

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        setSelected(prev => (prev - 1 + MENU_ITEMS.length) % MENU_ITEMS.length)
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        setSelected(prev => (prev + 1) % MENU_ITEMS.length)
      } else if (e.key === 'Enter' || e.key === ' ') {
        router.push(MENU_ITEMS[selected].route)
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [selected, router])

  return (
    <CRTScreen>
      <div className="min-h-dvh flex flex-col items-center justify-center p-8" role="main">
        {/* Title */}
        <div className="mb-2 font-press-start text-[10px] sm:text-xs tracking-widest"
          style={{ color: 'oklch(35% 0.10 62)' }}>
          INSERT COIN TO CONTINUE
        </div>
        <h1
          className="font-press-start text-xl sm:text-3xl mb-1 chromatic amber-glow text-center"
          style={{ color: 'oklch(90% 0.12 80)' }}
        >
          SUHAS.EXE
        </h1>
        <div className="font-vt323 text-xl mb-12 tracking-widest"
          style={{ color: 'oklch(68% 0.15 198)' }}>
          AI ENGINEER &amp; FULL STACK DEV
        </div>

        {/* Menu */}
        <nav aria-label="Main navigation">
          <ul className="space-y-2 w-full max-w-sm">
            {MENU_ITEMS.map((item, i) => {
              const active = i === selected
              return (
                <li key={item.route}>
                  <button
                    className="w-full flex items-center gap-4 px-6 py-3 font-press-start text-xs sm:text-sm text-left transition-all focus:outline-none"
                    style={{
                      color: active ? 'oklch(90% 0.12 80)' : 'oklch(55% 0.155 65)',
                      background: active ? 'oklch(10% 0.009 55)' : 'transparent',
                      border: active ? '2px solid oklch(78% 0.17 72)' : '2px solid transparent',
                      boxShadow: active ? '0 0 12px oklch(78% 0.17 72 / 0.3)' : 'none',
                    }}
                    onMouseEnter={() => setSelected(i)}
                    onClick={() => router.push(item.route)}
                    aria-current={active ? 'page' : undefined}
                  >
                    <span
                      className={active ? 'blink' : ''}
                      style={{
                        color: 'oklch(68% 0.15 198)',
                        opacity: active ? 1 : 0,
                        minWidth: '1ch',
                      }}
                    >
                      ▶
                    </span>
                    <span>{item.label}</span>
                    {active && (
                      <span className="ml-auto font-vt323 text-sm tracking-widest"
                        style={{ color: 'oklch(35% 0.10 62)' }}>
                        {item.hint}
                      </span>
                    )}
                  </button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Controls hint */}
        <div className="mt-12 font-vt323 text-base tracking-wide text-center"
          style={{ color: 'oklch(35% 0.10 62)' }}>
          ↑↓ / W S  NAVIGATE  &nbsp;·&nbsp;  ENTER / CLICK  SELECT
        </div>
      </div>
    </CRTScreen>
  )
}
