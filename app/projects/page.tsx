'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import { CRTScreen } from '@/components/CRTScreen'
import { projects } from '@/content/projects'

export default function ProjectsPage() {
  return (
    <CRTScreen>
      <div className="min-h-dvh p-6 sm:p-12 font-vt323" role="main">
        <div className="max-w-4xl mx-auto">
          <Link href="/menu" className="text-lg hover:underline focus:outline-none"
            style={{ color: 'oklch(68% 0.15 198)' }}>← BACK</Link>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}>
            <h1 className="font-press-start text-sm sm:text-base mt-8 mb-2 amber-glow chromatic"
              style={{ color: 'oklch(90% 0.12 80)' }}>PROJECTS</h1>
            <div className="mb-8 text-xl" style={{ color: 'oklch(35% 0.10 62)' }}>SELECT A CARTRIDGE TO LOAD</div>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {projects.map((p, i) => (
              <motion.div key={p.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}>
                <Link href={`/projects/${p.slug}`}
                  className="block project-card overflow-hidden focus:outline-none h-full">
                  <div className="relative w-full h-32 overflow-hidden"
                    style={{ background: 'oklch(10% 0.009 55)' }}>
                    <Image src={p.image} alt={`${p.title} preview`} fill
                      className="object-cover transition-opacity"
                      style={{ filter: 'sepia(0.6) hue-rotate(-15deg) saturate(1.1) brightness(0.75)', opacity: 0.9 }}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
                    <div className="absolute inset-0 pointer-events-none"
                      style={{
                        background: `repeating-linear-gradient(
                          to bottom, transparent 0px, transparent 3px,
                          oklch(0% 0 0 / 0.3) 3px, oklch(0% 0 0 / 0.3) 4px)`,
                      }} />
                    {p.featured && (
                      <div className="absolute top-2 left-2 font-press-start text-[7px] px-1 py-0.5"
                        style={{
                          color: 'oklch(82% 0.18 198)',
                          background: 'oklch(5% 0.007 55 / 0.85)',
                          border: '1px solid oklch(68% 0.15 198 / 0.5)',
                        }}>★ FEATURED</div>
                    )}
                  </div>
                  <div className="p-4">
                    <h2 className="font-press-start text-[9px] sm:text-[10px] leading-relaxed"
                      style={{ color: 'oklch(90% 0.12 80)' }}>{p.title}</h2>
                    <div className="mt-1 text-base" style={{ color: 'oklch(55% 0.155 65)' }}>{p.subtitle}</div>
                    <p className="mt-2 text-base leading-relaxed" style={{ color: 'oklch(65% 0.12 65)' }}>
                      {p.description.slice(0, 100)}…
                    </p>
                    <div className="mt-3 flex flex-wrap gap-1">
                      {p.tags.slice(0, 3).map(t => (
                        <span key={t} className="font-press-start text-[6px] px-1 py-0.5 border"
                          style={{ color: 'oklch(68% 0.15 198)', borderColor: 'oklch(68% 0.15 198 / 0.4)' }}>
                          {t}
                        </span>
                      ))}
                    </div>
                    <div className="mt-3 font-press-start text-[7px]" style={{ color: 'oklch(55% 0.155 65)' }}>
                      PRESS ENTER ▶
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </CRTScreen>
  )
}
