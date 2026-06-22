import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'motion/react'
import GlassPanel from '../components/GlassPanel'
import PageTransition from '../components/PageTransition'
import { projects } from '../../content/projects'
import { about } from '../../content/about'

const HERO_ART = '/art/hero.svg'

const featured = projects.find(p => p.featured) ?? projects[0]

const STATS = [
  { label: 'Repos',       value: '18' },
  { label: 'AI Projects', value: '8'  },
  { label: 'Languages',   value: '3'  },
]

const SOCIAL = [
  {
    label: 'GitHub',
    href: about.links.github,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/suhas-choudhary',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
  {
    label: 'Email',
    href: `mailto:${about.links.email}`,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4" aria-hidden="true">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
      </svg>
    ),
  },
]

export default function Home() {
  const [parallax, setParallax] = useState({ x: 0, y: 0 })
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  useEffect(() => {
    if (reduced) return
    function onMove(e: MouseEvent) {
      const cx = window.innerWidth / 2
      const cy = window.innerHeight / 2
      setParallax({ x: (e.clientX - cx) / cx * 16, y: (e.clientY - cy) / cy * 8 })
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [reduced])

  return (
    <PageTransition>
      <main id="main" className="relative min-h-dvh overflow-hidden">
        <h1 className="sr-only">Suhas Chowdary — AI Engineer &amp; Full Stack Developer</h1>

        {/* Hero background */}
        <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
          <motion.img
            src={HERO_ART}
            alt=""
            className="absolute inset-0 w-full h-full object-cover select-none"
            animate={reduced ? {} : { x: parallax.x, y: parallax.y }}
            transition={{ type: 'spring', stiffness: 25, damping: 18 }}
            style={{ willChange: reduced ? 'auto' : 'transform', scale: 1.05 }}
            loading="eager"
          />
          {/* Readability scrim */}
          <div className="absolute inset-0" style={{
            background: 'linear-gradient(135deg, oklch(8% 0.025 240 / 0.75) 0%, oklch(8% 0.025 240 / 0.42) 55%, oklch(8% 0.025 240 / 0.68) 100%)',
          }} />
          <div className="absolute bottom-0 left-0 right-0 h-56" style={{
            background: 'linear-gradient(to top, oklch(8% 0.025 240), transparent)',
          }} />
        </div>

        {/* Content overlay */}
        <div className="relative z-10 min-h-dvh flex flex-col pb-20 md:pb-0 md:pl-24">

          {/* Top bar */}
          <div className="flex items-center justify-between px-5 md:px-8 pt-6 md:pt-8">
            <motion.div initial={{ opacity: 0, x: -16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
              <span className="font-noto-jp text-2xl md:text-3xl font-bold teal-glow select-none"
                style={{ color: 'oklch(85% 0.20 185)' }} aria-label="Suhas">
                スハス
              </span>
              <span className="ml-3 text-[10px] font-sora tracking-[0.3em] uppercase hidden sm:inline"
                style={{ color: 'oklch(65% 0.04 240)' }}>
                AI Engineer
              </span>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
              <GlassPanel size="sm" className="px-3 py-1.5 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full pulse-glow shrink-0"
                  style={{ background: 'oklch(83% 0.22 155)' }} />
                <span className="text-[10px] md:text-xs font-sora" style={{ color: 'oklch(83% 0.22 155)' }}>
                  Open to Opportunities
                </span>
              </GlassPanel>
            </motion.div>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col md:flex-row gap-4 px-4 md:px-8 mt-4 md:mt-0 items-end md:items-stretch">

            {/* Left / center */}
            <div className="flex-1 flex flex-col justify-end gap-4 pb-6 md:pb-10">

              {/* Stats row */}
              <motion.div
                className="flex gap-2 md:gap-3"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {STATS.map((s, i) => (
                  <GlassPanel key={s.label} size="sm"
                    className="flex-1 p-2 md:p-3 text-center cursor-default"
                    style={{ animationDelay: `${i * 60}ms` }}>
                    <div className="text-xl md:text-3xl font-bebas teal-glow"
                      style={{ color: 'oklch(85% 0.20 185)' }}>{s.value}</div>
                    <div className="text-[8px] md:text-[10px] font-sora uppercase tracking-wider mt-0.5"
                      style={{ color: 'oklch(65% 0.04 240)' }}>{s.label}</div>
                  </GlassPanel>
                ))}
              </motion.div>

              {/* Featured project card */}
              <motion.div
                initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <GlassPanel className="p-5 md:p-6 max-w-md teal-box-glow">
                  <div className="text-[10px] font-sora tracking-[0.25em] uppercase mb-2"
                    style={{ color: 'oklch(75% 0.18 185)' }}>
                    ◈ Project 01 — Featured
                  </div>
                  <h2 className="font-bebas text-4xl md:text-5xl leading-none mb-1"
                    style={{ color: 'oklch(95% 0.01 240)' }}>
                    {featured.title}
                  </h2>
                  <p className="text-xs md:text-sm font-sora leading-relaxed mb-4"
                    style={{ color: 'oklch(65% 0.04 240)' }}>
                    {featured.subtitle} — {featured.description.slice(0, 90)}…
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/projects/${featured.slug}`}
                      className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-sora text-sm font-semibold
                                 transition-all hover:opacity-90 active:scale-95
                                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{
                        background: 'oklch(75% 0.18 185)',
                        color: 'oklch(8% 0.025 240)',
                        outlineColor: 'oklch(75% 0.18 185)',
                      }}>
                      <svg viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd"/>
                      </svg>
                      Start Adventure
                    </Link>
                    <Link to="/projects"
                      className="px-4 py-2 rounded-xl font-sora text-sm border transition-all
                                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{
                        color: 'oklch(85% 0.20 185)',
                        borderColor: 'oklch(75% 0.18 185 / 0.35)',
                        outlineColor: 'oklch(75% 0.18 185)',
                      }}>
                      All Projects →
                    </Link>
                  </div>
                </GlassPanel>
              </motion.div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4 md:w-72 lg:w-80 pb-6 md:pb-10 justify-end">

              {/* Greeting card */}
              <motion.div
                initial={{ opacity: 0, x: 28 }} animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.25 }}
              >
                <GlassPanel className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bebas text-xl shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, oklch(75% 0.18 185), oklch(55% 0.14 185))',
                        color: 'oklch(8% 0.025 240)',
                      }}>
                      S
                    </div>
                    <div>
                      <div className="font-bebas text-2xl leading-none" style={{ color: 'oklch(95% 0.01 240)' }}>
                        Hi, I'm Suhas 👋
                      </div>
                      <div className="text-[10px] font-sora" style={{ color: 'oklch(65% 0.04 240)' }}>
                        {about.class}
                      </div>
                    </div>
                  </div>

                  <div className="px-3 py-2 mb-3 rounded-xl"
                    style={{
                      background: 'oklch(100% 0 0 / 0.08)',
                      border: '1px solid oklch(100% 0 0 / 0.10)',
                    }}>
                    <div className="text-[9px] font-sora uppercase tracking-wider mb-0.5"
                      style={{ color: 'oklch(83% 0.22 155)' }}>
                      ▶ Currently Building
                    </div>
                    <div className="text-sm font-sora font-semibold" style={{ color: 'oklch(95% 0.01 240)' }}>
                      {featured.title}
                    </div>
                    <div className="text-[10px] font-sora mt-0.5" style={{ color: 'oklch(72% 0.04 240)' }}>
                      {featured.subtitle} · 2026
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {SOCIAL.map(s => (
                      <a key={s.label} href={s.href}
                        target={s.href.startsWith('mailto') ? undefined : '_blank'}
                        rel={s.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                        aria-label={s.label}
                        className="w-8 h-8 flex items-center justify-center rounded-lg glass-sm glass-hover
                                   transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                        style={{ color: 'oklch(65% 0.04 240)', outlineColor: 'oklch(75% 0.18 185)' }}>
                        {s.icon}
                      </a>
                    ))}
                  </div>
                </GlassPanel>
              </motion.div>

            </div>
          </div>
        </div>
      </main>
    </PageTransition>
  )
}
