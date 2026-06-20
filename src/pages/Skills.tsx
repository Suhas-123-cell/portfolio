import { motion } from 'motion/react'
import GlassPanel from '../components/GlassPanel'
import PageTransition from '../components/PageTransition'
import { skills } from '../../content/skills'

const CATS = ['AI/ML', 'Backend', 'Frontend', 'DevOps'] as const

const CAT_COLORS: Record<string, string> = {
  'AI/ML':    'oklch(75% 0.18 185)',
  'Backend':  'oklch(83% 0.22 155)',
  'Frontend': 'oklch(70% 0.19 42)',
  'DevOps':   'oklch(70% 0.15 285)',
}

export default function Skills() {
  return (
    <PageTransition>
      <main id="main" className="min-h-dvh px-4 md:pl-28 md:pr-8 py-8 md:py-12 pb-24 md:pb-12">
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }} className="mb-8 md:mb-10">
          <div className="text-[10px] font-sora tracking-[0.3em] uppercase mb-1"
            style={{ color: 'oklch(75% 0.18 185)' }}>◈ Stats Screen</div>
          <h1 className="font-bebas text-4xl md:text-5xl" style={{ color: 'oklch(95% 0.01 240)' }}>Skills</h1>
          <p className="mt-1 text-sm font-sora" style={{ color: 'oklch(72% 0.04 240)' }}>
            Player One attributes
          </p>
        </motion.div>

        <div className="max-w-xl space-y-6">
          {CATS.map((cat, ci) => {
            const catSkills = skills.filter(s => s.category === cat)
            if (!catSkills.length) return null
            const accent = CAT_COLORS[cat]
            return (
              <motion.div key={cat}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
                transition={{ delay: ci * 0.1, duration: 0.4 }}>
                <GlassPanel className="p-5 md:p-6">
                  <div className="text-[9px] font-sora uppercase tracking-[0.25em] mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: accent }} />
                    <span style={{ color: accent }}>{cat}</span>
                  </div>
                  <div className="space-y-4">
                    {catSkills.map((skill, si) => (
                      <motion.div key={skill.name}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                        transition={{ delay: ci * 0.1 + si * 0.06 }}>
                        <div className="flex justify-between mb-1.5">
                          <span className="text-sm font-sora" style={{ color: 'oklch(85% 0.01 240)' }}>
                            {skill.name}
                          </span>
                          <span className="text-[10px] font-sora font-semibold" style={{ color: accent }}>
                            LV.{skill.level}
                          </span>
                        </div>
                        <div className="relative h-2 rounded-full overflow-hidden"
                          style={{ background: 'oklch(100% 0 0 / 0.08)' }}
                          role="meter" aria-valuenow={skill.level} aria-valuemin={0} aria-valuemax={100}
                          aria-label={skill.name} aria-valuetext={`Level ${skill.level} out of 100`}>
                          <motion.div
                            className="absolute inset-y-0 left-0 rounded-full"
                            initial={{ width: '0%' }}
                            animate={{ width: `${skill.level}%` }}
                            transition={{ delay: ci * 0.1 + si * 0.06 + 0.2, duration: 0.9, ease: 'easeOut' }}
                            style={{
                              background: `linear-gradient(to right, ${accent}99, ${accent})`,
                              boxShadow: `0 0 8px ${accent}66`,
                            }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </GlassPanel>
              </motion.div>
            )
          })}
        </div>
      </main>
    </PageTransition>
  )
}
