import { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'

type Message = {
  role: 'user' | 'assistant'
  content: string
  audioUrl?: string
  audioLoading?: boolean
}

async function fetchTTS(text: string): Promise<string | null> {
  try {
    const r = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    if (!r.ok) return null
    const blob = await r.blob()
    return URL.createObjectURL(blob)
  } catch {
    return null
  }
}

const SUGGESTIONS = [
  "What have you built?",
  "What's your stack?",
  "Are you open to work?",
  "Tell me about StreakFight",
]

export default function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [voiceEnabled, setVoiceEnabled] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

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
  }, [open])

  const send = useCallback(async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    const history = messages.map(m => ({ role: m.role, content: m.content }))
    const assistantIndex = messages.length + 1

    setMessages(prev => [...prev, { role: 'user', content: trimmed }])
    setInput('')
    setLoading(true)

    try {
      const r = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: trimmed, history }),
      })
      const { text: reply } = await r.json() as { text: string }

      setMessages(prev => [...prev, {
        role: 'assistant',
        content: reply,
        audioLoading: voiceEnabled,
      }])

      if (voiceEnabled) fetchTTS(reply).then(url => {
          setMessages(prev => prev.map((m, i) =>
            i === assistantIndex ? { ...m, audioUrl: url ?? undefined, audioLoading: false } : m
          ))
          if (url) {
            audioRef.current = new Audio(url)
            audioRef.current.play().catch(() => {})
          }
        })
    } catch {
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "Sorry, something went wrong. Reach me at suhaschowdary25@gmail.com.",
      }])
    } finally {
      setLoading(false)
    }
  }, [messages, loading])

  const toggleMic = useCallback(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const w = window as any
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition
    if (!SR) return

    if (listening) {
      recognitionRef.current?.stop()
      setListening(false)
      return
    }

    const rec = new SR()
    rec.lang = 'en-US'
    rec.interimResults = false
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript
      send(transcript)
    }
    rec.onend = () => setListening(false)
    rec.onerror = () => setListening(false)
    recognitionRef.current = rec
    rec.start()
    setListening(true)
  }, [listening, send])

  return (
    <>
      {/* Floating trigger button */}
      <motion.button
        onClick={() => setOpen(o => !o)}
        className="fixed bottom-28 right-4 md:bottom-6 md:right-6 z-50 w-12 h-12 rounded-full
                   flex items-center justify-center shadow-lg
                   focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{
          background: open ? 'oklch(22% 0.04 240)' : 'oklch(75% 0.18 185)',
          color: open ? 'oklch(75% 0.18 185)' : 'oklch(8% 0.025 240)',
          outlineColor: 'oklch(75% 0.18 185)',
          boxShadow: '0 0 24px oklch(75% 0.18 185 / 0.35)',
          border: open ? '1px solid oklch(75% 0.18 185 / 0.3)' : 'none',
        }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.94 }}
        aria-label={open ? 'Close chat' : 'Ask Suhas'}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close"
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
              </svg>
            </motion.span>
          ) : (
            <motion.span key="chat"
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd"/>
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.96 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="fixed bottom-44 right-4 md:bottom-24 md:right-6 z-50 w-80 md:w-96
                       rounded-2xl overflow-hidden flex flex-col"
            style={{
              background: 'oklch(10% 0.025 240 / 0.97)',
              border: '1px solid oklch(75% 0.18 185 / 0.18)',
              backdropFilter: 'blur(24px)',
              boxShadow: '0 24px 64px oklch(0% 0 0 / 0.65), 0 0 0 1px oklch(75% 0.18 185 / 0.08)',
              maxHeight: '440px',
            }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 shrink-0"
              style={{ borderBottom: '1px solid oklch(100% 0 0 / 0.07)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center font-bebas text-sm shrink-0"
                style={{
                  background: 'linear-gradient(135deg, oklch(75% 0.18 185), oklch(55% 0.14 185))',
                  color: 'oklch(8% 0.025 240)',
                }}>
                S
              </div>
              <div>
                <div className="text-sm font-sora font-semibold" style={{ color: 'oklch(92% 0.01 240)' }}>
                  Ask Suhas
                </div>
                <button
                  onClick={() => setVoiceEnabled(v => !v)}
                  className="text-[10px] font-sora flex items-center gap-1.5 cursor-pointer"
                  style={{ color: voiceEnabled ? 'oklch(83% 0.22 155)' : 'oklch(55% 0.04 240)', background: 'none', border: 'none', padding: 0 }}
                  title={voiceEnabled ? 'Click to disable voice' : 'Click to enable voice'}
                >
                  <span className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: voiceEnabled ? 'oklch(83% 0.22 155)' : 'oklch(55% 0.04 240)' }} />
                  {voiceEnabled ? 'Voice on' : 'Voice off'}
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ minHeight: 0 }}>
              {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-[85%]">
                    <div className="text-sm font-sora leading-relaxed px-3 py-2 rounded-2xl"
                      style={m.role === 'user' ? {
                        background: 'oklch(75% 0.18 185)',
                        color: 'oklch(8% 0.025 240)',
                        borderBottomRightRadius: '4px',
                      } : {
                        background: 'oklch(100% 0 0 / 0.07)',
                        color: 'oklch(85% 0.01 240)',
                        border: '1px solid oklch(100% 0 0 / 0.1)',
                        borderBottomLeftRadius: '4px',
                      }}>
                      {m.content}
                    </div>
                    {m.role === 'assistant' && (
                      <div className="mt-1 ml-1 h-4">
                        {m.audioLoading && (
                          <span className="text-[9px] font-sora" style={{ color: 'oklch(60% 0.04 240)' }}>
                            🔊 loading voice…
                          </span>
                        )}
                        {m.audioUrl && !m.audioLoading && (
                          <button
                            onClick={() => {
                              audioRef.current = new Audio(m.audioUrl)
                              audioRef.current.play().catch(() => {})
                            }}
                            className="text-[9px] font-sora flex items-center gap-1 hover:opacity-80 transition-opacity"
                            style={{ color: 'oklch(75% 0.18 185)' }}>
                            <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                            </svg>
                            replay voice
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="px-3 py-2.5 rounded-2xl rounded-bl-sm flex gap-1 items-center"
                    style={{ background: 'oklch(100% 0 0 / 0.07)', border: '1px solid oklch(100% 0 0 / 0.1)' }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ background: 'oklch(75% 0.18 185)', animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </div>
              )}

              {messages.length === 1 && !loading && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {SUGGESTIONS.map(s => (
                    <button key={s} onClick={() => send(s)}
                      className="text-[10px] font-sora px-2.5 py-1 rounded-full transition-opacity hover:opacity-75"
                      style={{
                        background: 'oklch(75% 0.18 185 / 0.1)',
                        color: 'oklch(75% 0.18 185)',
                        border: '1px solid oklch(75% 0.18 185 / 0.25)',
                      }}>
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <div ref={bottomRef} />
            </div>

            {/* Input row */}
            <div className="px-3 py-3 shrink-0"
              style={{ borderTop: '1px solid oklch(100% 0 0 / 0.07)' }}>
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl"
                style={{
                  background: 'oklch(100% 0 0 / 0.05)',
                  border: '1px solid oklch(100% 0 0 / 0.1)',
                }}>
                <input
                  ref={inputRef}
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(input) }
                  }}
                  placeholder="Ask me anything…"
                  className="flex-1 bg-transparent text-sm font-sora outline-none"
                  style={{ color: 'oklch(88% 0.01 240)' }}
                  disabled={loading}
                />

                {/* Mic */}
                <button onClick={toggleMic}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-all shrink-0"
                  style={{
                    background: listening ? 'oklch(60% 0.22 25 / 0.15)' : 'transparent',
                    color: listening ? 'oklch(60% 0.22 25)' : 'oklch(55% 0.04 240)',
                  }}
                  aria-label={listening ? 'Stop listening' : 'Speak your question'}>
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
                    <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd"/>
                  </svg>
                </button>

                {/* Send */}
                <button onClick={() => send(input)}
                  disabled={!input.trim() || loading}
                  className="w-7 h-7 flex items-center justify-center rounded-lg transition-opacity disabled:opacity-25 shrink-0"
                  style={{ background: 'oklch(75% 0.18 185)', color: 'oklch(8% 0.025 240)' }}
                  aria-label="Send message">
                  <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                    <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z"/>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
