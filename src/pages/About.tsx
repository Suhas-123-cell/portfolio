import { motion } from 'motion/react'
import { Link } from 'react-router-dom'
import GlassPanel from '../components/GlassPanel'
import PageTransition from '../components/PageTransition'
import { about } from '../../content/about'

const ATTRS = [
  { label: 'Class',   value: about.class          },
  { label: 'Level',   value: String(about.level)  },
  { label: 'Origin',  value: about.origin         },
  { label: 'Weapon',  value: about.mainWeapon     },
  { label: 'Ability', value: about.specialAbility },
]

const QUICK_STATS = [
  { label: 'Repos shipped', value: '18'  },
  { label: 'AI projects',   value: '8'   },
  { label: 'Coffee / day',  value: '4☕' },
  { label: 'Years coding',  value: '3'   },
]

export default function About() {
  return (
    <PageTransition>
      <main id="main" className="min-h-dvh px-4 md:pl-28 md:pr-8 py-8 md:py-12 pb-24 md:pb-12">

        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }} className="mb-8">
          <div className="text-[10px] font-sora tracking-[0.3em] uppercase mb-1"
            style={{ color: 'oklch(75% 0.18 185)' }}>◈ Character Profile</div>
          <h1 className="font-bebas text-4xl md:text-5xl" style={{ color: 'oklch(95% 0.01 240)' }}>
            {about.name}
          </h1>
        </motion.div>

        <div className="flex flex-col xl:flex-row gap-6 max-w-5xl">

          {/* Left — profile card + bio + buttons */}
          <div className="flex-1 max-w-2xl space-y-4">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}>
              <GlassPanel className="p-5 md:p-6 flex items-center gap-5 teal-box-glow">
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
                    Suhas Choudary
                  </div>
                  <div className="text-sm font-sora mt-0.5" style={{ color: 'oklch(75% 0.18 185)' }}>
                    {about.class}
                  </div>
                  <div className="text-xs font-sora mt-1" style={{ color: 'oklch(72% 0.04 240)' }}>
                    {about.origin}
                  </div>
                </div>
              </GlassPanel>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}>
              <GlassPanel className="p-5 md:p-6 space-y-4">
                {about.bio.map((para, i) => (
                  <p key={i} className="text-sm md:text-base font-sora leading-relaxed"
                    style={{ color: i === 0 ? 'oklch(90% 0.01 240)' : 'oklch(73% 0.03 240)' }}>
                    {para}
                  </p>
                ))}
              </GlassPanel>
            </motion.div>

            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
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
              <Link to="/contact"
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

          {/* Right — attributes + quick stats + availability */}
          <div className="xl:w-72 space-y-3">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}>
              <GlassPanel className="p-4">
                <div className="text-[9px] font-sora tracking-[0.25em] uppercase mb-3"
                  style={{ color: 'oklch(65% 0.04 240)' }}>Character Attributes</div>
                <div className="space-y-2">
                  {ATTRS.map((a) => (
                    <div key={a.label} className="flex items-start justify-between gap-3 py-1.5 border-b last:border-0"
                      style={{ borderColor: 'oklch(100% 0 0 / 0.07)' }}>
                      <span className="text-[10px] font-sora uppercase tracking-wider"
                        style={{ color: 'oklch(60% 0.04 240)' }}>{a.label}</span>
                      <span className="text-xs font-sora font-semibold text-right"
                        style={{ color: 'oklch(85% 0.20 185)' }}>{a.value}</span>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}>
              <GlassPanel className="p-4">
                <div className="text-[9px] font-sora tracking-[0.25em] uppercase mb-3"
                  style={{ color: 'oklch(65% 0.04 240)' }}>Quick Stats</div>
                <div className="grid grid-cols-2 gap-2">
                  {QUICK_STATS.map((s) => (
                    <div key={s.label} className="p-2.5 rounded-xl text-center"
                      style={{ background: 'oklch(100% 0 0 / 0.05)', border: '1px solid oklch(100% 0 0 / 0.08)' }}>
                      <div className="font-bebas text-2xl teal-glow"
                        style={{ color: 'oklch(85% 0.20 185)' }}>{s.value}</div>
                      <div className="text-[9px] font-sora uppercase tracking-wide mt-0.5"
                        style={{ color: 'oklch(60% 0.04 240)' }}>{s.label}</div>
                    </div>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}>
              <GlassPanel size="sm" className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full pulse-glow shrink-0"
                    style={{ background: 'oklch(83% 0.22 155)' }} />
                  <span className="text-[10px] font-sora uppercase tracking-wider"
                    style={{ color: 'oklch(83% 0.22 155)' }}>Available Now</span>
                </div>
                <p className="text-xs font-sora leading-relaxed"
                  style={{ color: 'oklch(65% 0.04 240)' }}>
                  Open to AI/ML engineering and fullstack roles. Based in India (IST).
                </p>
              </GlassPanel>
            </motion.div>
          </div>

        </div>
      </main>
    </PageTransition>
  )
}
