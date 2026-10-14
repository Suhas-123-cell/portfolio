import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { MessageCircle, Send, X } from 'lucide-react'
import WebMark from './WebMark'

type Message = {
  role: 'user' | 'assistant'
  content: string
}

const SUGGESTIONS = [
  "What have you built?",
  "What's your stack?",
  "Are you open to work?",
  "Tell me about IntentShield",
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{
        role: 'assistant',
        content: "Hey! I'm Suhas. Ask me anything about my projects, stack, or experience.",
      }])
    }
    if (open) setTimeout(() => inputRef.current?.focus(), 300)
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      setOpen(false)
      triggerRef.current?.focus()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const history = messages
      .filter(m => typeof m.content === 'string' && m.content.length > 0)
      .map(m => ({ role: m.role, content: m.content }))

    setMessages(prev => [...prev, { role: 'user', content: trimmed }])
    setInput('')
    setLoading(true)

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      })
      if (r.status === 429) throw new Error('rate')
      if (!r.ok) throw new Error('chat')
      const data = await r.json() as { text?: unknown }
      const reply = typeof data.text === 'string' && data.text.trim() ? data.text : null
      if (!reply) throw new Error('empty')
      setMessages(prev => [...prev, { role: 'assistant', content: reply }])
    } catch (err) {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: err instanceof Error && err.message === 'rate'
          ? "Whoa, my spider-sense says slow down. Give it a minute and ask again."
          : "Sorry, something went wrong. Reach me at suhaschowdary25@gmail.com.",
      }])
    } finally {
      setLoading(false)
      inputRef.current?.focus()
    }
  }, [messages, loading])

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        ref={triggerRef}
        onClick={() => setOpen(o => !o)}
        className={`fixed bottom-5 right-4 z-50 flex h-14 w-14 items-center justify-center border-2 border-line md:bottom-6 md:right-6 ${
          open ? 'bg-ink-2 text-paper' : 'bg-hero text-hero-ink'
        }`}
        style={{ boxShadow: '4px 4px 0 var(--web)' }}
        whileHover={{ x: -2, y: -2 }}
        whileTap={{ x: 2, y: 2 }}
        aria-label={open ? 'Close chat' : 'Ask Suhas'}
        aria-expanded={open}
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={open ? 'close' : 'chat'}
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            {open ? <X size={22} aria-hidden /> : <MessageCircle size={22} aria-hidden />}
          </motion.span>
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-label="Chat with Suhas"
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="panel fixed bottom-24 right-4 z-50 flex max-h-[min(460px,70dvh)] w-[calc(100vw-2rem)] origin-bottom-right flex-col overflow-hidden sm:w-96 md:bottom-24 md:right-6"
          >
            {/* Header */}
            <div className="flex shrink-0 items-center gap-3 border-b-2 border-line bg-hero px-4 py-3 text-hero-ink">
              <WebMark className="h-8 w-8 shrink-0" />
              <div className="min-w-0 flex-1">
                <div className="font-display text-xl leading-none">Ask Suhas</div>
                <div className="mt-1 text-[11px] font-semibold opacity-85">AI engineer, full stack dev</div>
              </div>
            </div>

            {/* Messages */}
            <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4" aria-live="polite">
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] border-2 px-3 py-2 text-sm leading-relaxed ${
                      m.role === 'user'
                        ? 'border-line bg-web text-web-ink'
                        : 'border-caption-ink bg-caption text-caption-ink'
                    }`}
                  >
                    {m.content}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="flex items-center gap-1 border-2 border-caption-ink bg-caption px-3 py-2.5">
                    {[0, 1, 2].map(i => (
                      <span key={i} className="h-1.5 w-1.5 animate-bounce bg-caption-ink" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}

              {messages.length === 1 && !loading && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTIONS.map(s => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="border-2 border-paper-dim px-2.5 py-1 text-xs font-semibold text-paper transition-colors hover:border-hero hover:bg-hero hover:text-hero-ink"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input row */}
            <div className="shrink-0 border-t-2 border-line p-3">
              <div className="flex items-center gap-2 border-2 border-paper-dim bg-ink px-3 py-2 focus-within:border-caption">
                <label htmlFor="chat-input" className="sr-only">Your question</label>
                <input
                  id="chat-input"
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
                  }}
                  placeholder="Ask me anything…"
                  className="flex-1 bg-transparent text-sm text-paper outline-none placeholder:text-paper-dim"
                  readOnly={loading}
                  aria-busy={loading}
                />

                <button
                  onClick={() => send(input)}
                  disabled={!input.trim() || loading}
                  className="flex h-8 w-8 shrink-0 items-center justify-center bg-hero text-hero-ink transition-opacity disabled:opacity-30"
                  aria-label="Send message"
                >
                  <Send size={15} aria-hidden />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
