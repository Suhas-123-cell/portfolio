'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { GlassPanel } from '@/components/GlassPanel'
import { projects } from '@/content/projects'

export default function ProjectsPage() {
  return (
    <main className="min-h-dvh px-4 md:pl-28 md:pr-8 py-8 md:py-12 pb-24 md:pb-12" role="main">
      <motion.div
        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 md:mb-10"
      >
        <div className="text-[10px] font-sora tracking-[0.3em] uppercase mb-1"
          style={{ color: 'oklch(75% 0.18 185)' }}>◈ Level Select</div>
        <h1 className="font-bebas text-4xl md:text-5xl" style={{ color: 'oklch(95% 0.01 240)' }}>Projects</h1>
        <p className="mt-1 text-sm font-sora" style={{ color: 'oklch(65% 0.04 240)' }}>
          {projects.length} quests in the codex
        </p>
      </motion.div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
        {projects.map((p, i) => (
          <motion.div key={p.slug}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}>
            <Link href={`/projects/${p.slug}`}
              className="block project-card glass rounded-2xl overflow-hidden h-full
                         focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
              style={{ border: '1px solid oklch(100% 0 0 / 0.12)', outlineColor: 'oklch(75% 0.18 185)' }}>

              <div className="relative h-36 overflow-hidden" style={{ background: 'oklch(12% 0.02 240)' }}>
                <img src={p.image} alt={`${p.title} preview`}
                  className="w-full h-full object-cover opacity-80" loading="lazy" />
                <div className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, oklch(8% 0.025 240 / 0.7), transparent 60%)' }} />
                {p.featured && (
                  <span className="absolute top-2 left-2 text-[9px] font-sora tracking-wider uppercase px-2 py-0.5 rounded-full"
                    style={{
                      background: 'oklch(75% 0.18 185 / 0.15)',
                      color: 'oklch(85% 0.20 185)',
                      border: '1px solid oklch(75% 0.18 185 / 0.3)',
                    }}>★ Featured</span>
                )}
              </div>

              <div className="p-4 md:p-5">
                <div className="text-[9px] font-sora tracking-[0.2em] uppercase mb-1"
                  style={{ color: 'oklch(75% 0.18 185)' }}>{p.subtitle}</div>
                <h2 className="font-bebas text-2xl md:text-3xl leading-none mb-2"
                  style={{ color: 'oklch(95% 0.01 240)' }}>{p.title}</h2>
                <p className="text-xs font-sora leading-relaxed mb-3"
                  style={{ color: 'oklch(65% 0.04 240)' }}>
                  {p.description.slice(0, 110)}…
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {p.tags.slice(0, 4).map(t => (
                    <span key={t} className="text-[9px] font-sora px-2 py-0.5 rounded-full"
                      style={{
                        background: 'oklch(75% 0.18 185 / 0.1)',
                        color: 'oklch(75% 0.18 185)',
                        border: '1px solid oklch(75% 0.18 185 / 0.25)',
                      }}>{t}</span>
                  ))}
                </div>
                <div className="mt-3 text-[10px] font-sora" style={{ color: 'oklch(75% 0.18 185)' }}>
                  View Quest →
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </main>
  )
}
