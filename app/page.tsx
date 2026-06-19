'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'motion/react'
import { CRTScreen } from '@/components/CRTScreen'
import { useTypeWriter } from '@/components/TypeWriter'

const BOOT_LINES = [
  'SUHAS-OS v2.4.1 (Build 2026-06-19)',
  'Copyright (C) 2026 Suhas Chowdary. All rights reserved.',
  '',
  'Initializing hardware...',
  '  [  OK  ] Neural processing unit detected',
  '  [  OK  ] Coffee consumption module: 4 cups/day',
  '  [  OK  ] GitHub sync: 18 repositories indexed',
  '  [  OK  ] YOLOv8n model weights loaded',
  '  [  OK  ] FastAPI runtime: 47 endpoints registered',
  '  [  OK  ] Supabase connection: authenticated',
  '',
  'Loading personality matrix...',
  '  [  OK  ] Problem-solving algorithms initialized',
  '  [  OK  ] Ships-at-3am module: ACTIVE',
  '  [  OK  ] Stack Overflow access: UNLIMITED',
  '',
  'Boot sequence complete.',
  '─────────────────────────────────────────',
]

export default function BootScreen() {
  const router = useRouter()
  const { displayed, done } = useTypeWriter(BOOT_LINES, 18, 60)
  const [pressed, setPressed] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [displayed])

  useEffect(() => {
    if (!done) return
    function go() { navigate() }
    window.addEventListener('keydown', go, { once: true })
    return () => window.removeEventListener('keydown', go)
  }, [done])

  function navigate() {
    if (pressed) return
    setPressed(true)
    router.push('/menu')
  }

  return (
    <CRTScreen>
      {/* CRT power-on effect wraps the whole content */}
      <motion.div
        className="min-h-dvh flex flex-col p-4 sm:p-8 font-vt323 text-lg sm:text-xl overflow-y-auto cursor-pointer"
        initial={{ clipPath: 'inset(50% 0)', filter: 'brightness(4)' }}
        animate={{ clipPath: 'inset(0% 0)', filter: 'brightness(1)' }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        onClick={done ? navigate : undefined}
        role="main"
        aria-label="Boot screen, press any key to start"
      >
        <div className="max-w-2xl mx-auto w-full pt-8">
          {displayed.map((line, i) => (
            <div key={i} className="leading-relaxed"
              style={{
                color: line.startsWith('  [  OK  ]')
                  ? 'oklch(68% 0.15 198)'
                  : line.startsWith('──')
                  ? 'oklch(35% 0.10 62)'
                  : 'oklch(78% 0.17 72)',
              }}>
              {line || ' '}
            </div>
          ))}

          {done && (
            <motion.div className="mt-8 text-center"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
              <div className="font-press-start text-xs sm:text-sm amber-glow chromatic blink"
                style={{ color: 'oklch(90% 0.12 80)' }}>
                ▶ PRESS ANY KEY TO START
              </div>
              <div className="mt-3 font-vt323 text-base" style={{ color: 'oklch(35% 0.10 62)' }}>
                [ or click anywhere ]
              </div>
            </motion.div>
          )}
          <div ref={bottomRef} />
        </div>
      </motion.div>
    </CRTScreen>
  )
}
