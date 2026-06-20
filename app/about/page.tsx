'use client'

import { motion } from 'motion/react'
import Link from 'next/link'
import { GlassPanel } from '@/components/GlassPanel'
import { about } from '@/content/about'

const ATTRS = [
  { label: 'Class',   value: about.class          },
  { label: 'Level',   value: String(about.level)  },
  { label: 'Origin',  value: about.origin         },
  { label: 'Weapon',  value: about.mainWeapon     },
  { label: 'Ability', value: about.specialAbility },
]

export default function AboutPage() {
  return (
    <main className="min-h-dvh px-4 md:pl-28 md:pr-8 py-8 md:py-12 pb-24 md:pb-12" role="main">
      <div className="max-w-2xl">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }} className="mb-8">
          <div className="text-[10px] font-sora tracking-[0.3em] uppercase mb-1"
            style={{ color: 'oklch(75% 0.18 185)' }}>◈ Character Profile</div>
          <h1 className="font-bebas text-4xl md:text-5xl" style={{ color: 'oklch(95% 0.01 240)' }}>
            {about.name}
          </h1>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}>
          <GlassPanel className="p-5 md:p-6 mb-4 flex items-center gap-5 teal-box-glow">
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center
                            font-bebas text-3xl md:text-4xl shrink-0"
              style={{
                background: 'linear-gradient(135deg, oklch(75% 0.18 185), oklch(55% 0.14 185))',
                color: 'oklch(8% 0.025 240)',
              }}>
              S
            </div>
            <div>
              <div className="font-bebas text-2xl md:text-3xl" style={{ color: 'oklch(95% 0.01 240)' }}>
                Suhas Chowdary
              </div>
              <div className="text-sm font-sora mt-0.5" style={{ color: 'oklch(75% 0.18 185)' }}>
                {about.class}
              </div>
              <div className="text-xs font-sora mt-1" style={{ color: 'oklch(65% 0.04 240)' }}>
                📍 {about.origin}
              </div>
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {ATTRS.map((a, i) => (
            <GlassPanel key={a.label} size="sm" className="p-3"
              style={{ animationDelay: `${i * 50}ms` }}>
              <div className="text-[8px] font-sora uppercase tracking-wider mb-1"
                style={{ color: 'oklch(65% 0.04 240)' }}>{a.label}</div>
              <div className="text-xs md:text-sm font-sora font-semibold"
                style={{ color: 'oklch(85% 0.20 185)' }}>{a.value}</div>
            </GlassPanel>
          ))}
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}>
          <GlassPanel className="p-5 md:p-6 mb-6 space-y-4">
            {about.bio.map((para, i) => (
              <p key={i} className="text-sm md:text-base font-sora leading-relaxed"
                style={{ color: i === 0 ? 'oklch(90% 0.01 240)' : 'oklch(70% 0.03 240)' }}>
                {para}
              </p>
            ))}
          </GlassPanel>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
          className="flex gap-3">
          <a href={about.links.github} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-sora text-sm font-semibold
                       transition-all hover:opacity-90 active:scale-95
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              background: 'oklch(75% 0.18 185)',
              color: 'oklch(8% 0.025 240)',
              outlineColor: 'oklch(75% 0.18 185)',
            }}>
            GitHub ↗
          </a>
          <Link href="/contact"
            className="px-5 py-2.5 rounded-xl font-sora text-sm border transition-all
                       focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              color: 'oklch(85% 0.20 185)',
              borderColor: 'oklch(75% 0.18 185 / 0.35)',
              outlineColor: 'oklch(75% 0.18 185)',
            }}>
            Contact →
          </Link>
        </motion.div>
      </div>
    </main>
  )
}
