import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { Check, Copy, Github, Mail } from 'lucide-react'
import PageTransition from '../components/PageTransition'
import WebMark from '../components/WebMark'
import { about } from '../../content/about'

export default function Contact() {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(about.links.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      window.location.href = `mailto:${about.links.email}`
    }
  }

  return (
    <PageTransition title="Contact | Suhas Choudary">
      <section className="relative mx-auto max-w-7xl overflow-hidden px-4 pt-32 md:px-8 md:pt-40">
        <WebMark className="pointer-events-none absolute -right-40 top-10 h-[42rem] w-[42rem] text-paper/[0.06]" strokeWidth={0.7} />

        <h1 className="font-display misprint relative text-7xl md:text-[9rem]">
          Drop me
          <br />a line
        </h1>
        <p className="relative mt-6 max-w-[44ch] text-xl leading-relaxed text-paper/90">
          Internships, collaborations, or a bug you found in one of my repos. My inbox is open.
        </p>

        <div className="relative mt-12 flex flex-col items-start gap-6">
          <div className="flex flex-wrap items-center gap-5">
            <a href={`mailto:${about.links.email}`} className="btn btn-hero sense text-lg md:text-2xl">
              <Mail size={22} aria-hidden /> {about.links.email}
            </a>
            <button type="button" onClick={copy} className="btn btn-ghost" aria-live="polite">
              {copied ? <Check size={18} aria-hidden /> : <Copy size={18} aria-hidden />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <AnimatePresence>
              {copied && (
                <motion.span
                  aria-hidden
                  initial={{ scale: 0.4, opacity: 0, rotate: -12 }}
                  animate={{ scale: 1, opacity: 1, rotate: -6 }}
                  exit={{ opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 600, damping: 14 }}
                  className="sfx text-4xl"
                >
                  THWIP!
                </motion.span>
              )}
            </AnimatePresence>
          </div>
          <a href={about.links.github} target="_blank" rel="noreferrer" className="btn btn-ghost">
            <Github size={18} aria-hidden /> github.com/{about.links.github.split('/').pop()}
          </a>
        </div>

        <p className="relative mt-16 max-w-[52ch] text-paper-dim">
          Prefer to ask first? The chat bubble in the corner answers questions about my projects.
        </p>
      </section>
    </PageTransition>
  )
}
