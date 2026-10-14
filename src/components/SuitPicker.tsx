import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { SUITS, isNoirUnlocked, setSuit, useSuit } from '../lib/suit'

function Swatch({ colors }: { colors: [string, string] }) {
  return (
    <span
      aria-hidden
      className="block h-5 w-5 border-2 border-line"
      style={{ background: `linear-gradient(135deg, ${colors[0]} 50%, ${colors[1]} 50%)` }}
    />
  )
}

export default function SuitPicker() {
  const suit = useSuit()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const current = SUITS.find((s) => s.id === suit) ?? SUITS[0]
  const options = SUITS.filter((s) => !s.hidden || s.id === suit || isNoirUnlocked())

  useEffect(() => {
    if (!open) return
    const onDown = (e: PointerEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  return (
    <div ref={ref} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        aria-controls="suit-list"
        aria-label={`Change suit, current: ${current.name}`}
        title="Change suit (theme)"
        className="flex h-10 items-center gap-2 border-2 border-line bg-ink-2 px-2.5 text-sm font-semibold transition-transform hover:-translate-y-0.5"
      >
        <Swatch colors={current.colors} />
        <span className="hidden sm:inline">Suit: {current.name}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            id="suit-list"
            aria-label="Suits"
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="panel absolute right-0 top-[calc(100%+10px)] w-48 origin-top-right p-1.5"
          >
            {options.map((s) => (
              <li key={s.id}>
                <button
                  type="button"
                  aria-pressed={s.id === suit}
                  onClick={() => {
                    setSuit(s.id)
                    setOpen(false)
                    triggerRef.current?.focus()
                  }}
                  className={`flex w-full items-center gap-3 px-2.5 py-2 text-left text-sm font-semibold transition-colors hover:bg-ink-3 ${s.id === suit ? 'bg-ink-3' : ''}`}
                >
                  <Swatch colors={s.colors} />
                  {s.name}
                  {s.id === suit && <span className="ml-auto text-xs text-paper-dim">wearing</span>}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  )
}
