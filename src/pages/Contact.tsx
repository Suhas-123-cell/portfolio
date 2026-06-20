import { motion } from 'motion/react'
import GlassPanel from '../components/GlassPanel'
import PageTransition from '../components/PageTransition'
import { about } from '../../content/about'

const LINKS = [
  {
    label: 'Email',
    value: about.links.email,
    href: `mailto:${about.links.email}`,
    icon: (
      <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"/>
        <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"/>
      </svg>
    ),
  },
  {
    label: 'GitHub',
    value: 'Suhas-123-cell',
    href: about.links.github,
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    value: 'suhas-chowdary',
    href: 'https://linkedin.com/in/suhas-choudhary',
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5" aria-hidden="true">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
      </svg>
    ),
  },
]

export default function Contact() {
  return (
    <PageTransition>
      <main id="main" className="min-h-dvh px-4 md:pl-28 md:pr-8 py-8 md:py-12 pb-24 md:pb-12">
        <div className="max-w-lg">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }} className="mb-8">
            <div className="text-[10px] font-sora tracking-[0.3em] uppercase mb-1"
              style={{ color: 'oklch(75% 0.18 185)' }}>◈ Terminal</div>
            <h1 className="font-bebas text-4xl md:text-5xl" style={{ color: 'oklch(95% 0.01 240)' }}>Contact</h1>
            <p className="mt-1 text-sm font-sora" style={{ color: 'oklch(65% 0.04 240)' }}>
              Open to AI / fullstack roles and interesting problems.
            </p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}>
            <GlassPanel className="p-5 md:p-6 mb-4 teal-box-glow">
              <div className="text-[9px] font-sora uppercase tracking-[0.25em] mb-4"
                style={{ color: 'oklch(65% 0.04 240)' }}>Reach me at</div>
              <div className="space-y-2">
                {LINKS.map((link, i) => (
                  <motion.a key={link.label}
                    href={link.href}
                    target={link.href.startsWith('mailto') ? undefined : '_blank'}
                    rel={link.href.startsWith('mailto') ? undefined : 'noopener noreferrer'}
                    initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.08 }}
                    className="flex items-center gap-4 p-3 rounded-xl transition-colors
                               focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2
                               hover:bg-white/5 group"
                    style={{ outlineColor: 'oklch(75% 0.18 185)' }}>
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center glass-sm shrink-0"
                      style={{ color: 'oklch(75% 0.18 185)' }}>
                      {link.icon}
                    </div>
                    <div>
                      <div className="text-[9px] font-sora uppercase tracking-wider"
                        style={{ color: 'oklch(65% 0.04 240)' }}>{link.label}</div>
                      <div className="text-sm font-sora font-semibold transition-colors"
                        style={{ color: 'oklch(85% 0.20 185)' }}>{link.value}</div>
                    </div>
                    <span className="ml-auto text-sm" style={{ color: 'oklch(65% 0.04 240)' }}>↗</span>
                  </motion.a>
                ))}
              </div>
            </GlassPanel>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.35 }}>
            <GlassPanel size="sm" className="p-4">
              <p className="text-xs font-sora leading-relaxed" style={{ color: 'oklch(65% 0.04 240)' }}>
                Best way to reach me is email — I reply within 24 hours.
                For code questions, GitHub DMs are open too.
              </p>
            </GlassPanel>
          </motion.div>
        </div>
      </main>
    </PageTransition>
  )
}
