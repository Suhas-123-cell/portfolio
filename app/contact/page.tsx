'use client'

import { useState } from 'react'
import Link from 'next/link'
import { CRTScreen } from '@/components/CRTScreen'
import { about } from '@/content/about'

type LogLine = { text: string; color?: string }

const INIT_LOG: LogLine[] = [
  { text: '$ ssh suhas@portfolio.local', color: 'oklch(68% 0.15 198)' },
  { text: 'Connected to SUHAS-OS v2.4.1' },
  { text: 'Type a command or click a link below.' },
  { text: '' },
  { text: 'Available commands:', color: 'oklch(35% 0.10 62)' },
  { text: '  email    — open email client' },
  { text: '  github   — open GitHub profile' },
  { text: '  back     — return to menu' },
  { text: '  clear    — clear terminal' },
  { text: '' },
]

export default function ContactPage() {
  const [log, setLog] = useState<LogLine[]>(INIT_LOG)
  const [input, setInput] = useState('')

  function runCommand(cmd: string) {
    const trimmed = cmd.trim().toLowerCase()
    const entry: LogLine = { text: `$ ${cmd}`, color: 'oklch(68% 0.15 198)' }

    if (trimmed === 'clear') {
      setLog([{ text: 'Terminal cleared.', color: 'oklch(35% 0.10 62)' }, { text: '' }])
      return
    }

    if (trimmed === 'email') {
      window.location.href = `mailto:${about.links.email}`
      setLog(prev => [...prev, entry, { text: `Opening ${about.links.email}...`, color: 'oklch(78% 0.17 72)' }, { text: '' }])
      return
    }

    if (trimmed === 'github') {
      window.open(about.links.github, '_blank', 'noopener,noreferrer')
      setLog(prev => [...prev, entry, { text: 'Opening GitHub...', color: 'oklch(78% 0.17 72)' }, { text: '' }])
      return
    }

    if (trimmed === 'back') {
      window.location.href = '/menu'
      return
    }

    if (trimmed === '') return

    setLog(prev => [...prev, entry, { text: `command not found: ${trimmed}`, color: 'oklch(60% 0.18 28)' }, { text: '' }])
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    runCommand(input)
    setInput('')
  }

  return (
    <CRTScreen>
      <div className="min-h-dvh p-6 sm:p-12 font-vt323" role="main">
        <div className="max-w-2xl mx-auto">
          <Link href="/menu" className="text-lg hover:underline focus:outline-none"
            style={{ color: 'oklch(68% 0.15 198)' }}>
            ← BACK
          </Link>

          <h1 className="font-press-start text-[9px] sm:text-xs mt-8 mb-6 amber-glow chromatic"
            style={{ color: 'oklch(90% 0.12 80)' }}>
            CONTACT TERMINAL
          </h1>

          {/* Terminal output */}
          <div
            className="border-2 p-4 sm:p-6 min-h-64 mb-0 text-xl leading-relaxed"
            style={{
              borderColor: 'oklch(55% 0.155 65)',
              background: 'oklch(3% 0.004 55)',
            }}
            aria-live="polite"
            aria-label="Terminal output"
          >
            {log.map((line, i) => (
              <div key={i} style={{ color: line.color ?? 'oklch(78% 0.17 72)' }}>
                {line.text || <>&nbsp;</>}
              </div>
            ))}
          </div>

          {/* Input */}
          <form onSubmit={handleSubmit}
            className="border-2 border-t-0 flex items-center px-4 py-2"
            style={{ borderColor: 'oklch(55% 0.155 65)', background: 'oklch(3% 0.004 55)' }}>
            <span className="text-xl mr-2" style={{ color: 'oklch(68% 0.15 198)' }}>$</span>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              className="flex-1 bg-transparent text-xl focus:outline-none caret-amber-glow"
              style={{ color: 'oklch(78% 0.17 72)' }}
              autoFocus
              autoComplete="off"
              spellCheck={false}
              aria-label="Terminal input"
              placeholder="type a command..."
            />
          </form>

          {/* Quick links */}
          <div className="mt-6 flex gap-6 font-press-start text-[9px]">
            <button onClick={() => runCommand('email')}
              className="cyan-glow hover:underline focus:outline-none"
              style={{ color: 'oklch(82% 0.18 198)' }}>
              EMAIL ↗
            </button>
            <button onClick={() => runCommand('github')}
              className="amber-glow hover:underline focus:outline-none"
              style={{ color: 'oklch(78% 0.17 72)' }}>
              GITHUB ↗
            </button>
          </div>
        </div>
      </div>
    </CRTScreen>
  )
}
