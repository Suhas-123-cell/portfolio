'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import { CRTScreen } from '@/components/CRTScreen'
import { skills } from '@/content/skills'

const CATS = ['AI/ML', 'Backend', 'Frontend', 'DevOps'] as const

export default function SkillsPage() {
  return (
    <CRTScreen>
      <div className="min-h-dvh p-6 sm:p-12 font-vt323" role="main">
        <div className="max-w-2xl mx-auto">
          <Link href="/menu" className="text-lg hover:underline focus:outline-none"
            style={{ color: 'oklch(68% 0.15 198)' }}>← BACK</Link>

          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="font-press-start text-sm sm:text-base mt-8 mb-2 amber-glow chromatic"
              style={{ color: 'oklch(90% 0.12 80)' }}>STATS SCREEN</h1>
            <div className="mb-8 text-xl" style={{ color: 'oklch(35% 0.10 62)' }}>PLAYER ONE ATTRIBUTES</div>
          </motion.div>

          {CATS.map((cat, ci) => {
            const catSkills = skills.filter(s => s.category === cat)
            if (!catSkills.length) return null
            return (
              <motion.div key={cat} className="mb-8"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: ci * 0.1, duration: 0.4 }}>
                <div className="font-press-start text-[8px] mb-4 tracking-widest"
                  style={{ color: 'oklch(68% 0.15 198)' }}>── {cat} ──</div>
                <div className="space-y-3">
                  {catSkills.map((skill, si) => (
                    <motion.div key={skill.name}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: ci * 0.1 + si * 0.06 }}>
                      <div className="flex justify-between mb-1 text-base">
                        <span style={{ color: 'oklch(78% 0.17 72)' }}>{skill.name}</span>
                        <span className="font-press-start text-[8px]" style={{ color: 'oklch(55% 0.155 65)' }}>
                          LV.{skill.level}
                        </span>
                      </div>
                      <div className="relative h-4 border overflow-hidden"
                        style={{ background: 'oklch(10% 0.009 55)', borderColor: 'oklch(35% 0.10 62)' }}
                        role="meter" aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={100}
                        aria-label={`${skill.name}: level ${skill.level}`}>
                        <motion.div className="absolute inset-y-0 left-0"
                          initial={{ width: '0%' }}
                          animate={{ width: `${skill.level}%` }}
                          transition={{ delay: ci * 0.1 + si * 0.06 + 0.2, duration: 0.8, ease: 'easeOut' }}
                          style={{
                            background: 'linear-gradient(to right, oklch(55% 0.155 65), oklch(78% 0.17 72))',
                            boxShadow: '0 0 8px oklch(78% 0.17 72 / 0.5)',
                          }} />
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </CRTScreen>
  )
}
