import { useParams, Link } from 'react-router-dom'
import { motion } from 'motion/react'
import GlassPanel from '../components/GlassPanel'
import PageTransition from '../components/PageTransition'
import { projects } from '../../content/projects'
import NotFound from './NotFound'

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = projects.find(p => p.slug === slug)

  if (!project) return <NotFound />

  const idx = projects.findIndex(p => p.slug === slug)

  return (
    <PageTransition>
      <main id="main" className="min-h-dvh px-4 md:pl-28 md:pr-8 py-8 md:py-12 pb-24 md:pb-12">

        <Link to="/projects"
          className="inline-flex items-center gap-1.5 text-sm font-sora mb-8
                     focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 rounded"
          style={{ color: 'oklch(75% 0.18 185)', outlineColor: 'oklch(75% 0.18 185)' }}>
          ← All Projects
        </Link>

        {/* Hero image */}
        <GlassPanel className="overflow-hidden mb-6 max-w-5xl" style={{ padding: 0 }}>
          <div className="relative h-52 md:h-72" style={{ background: 'oklch(12% 0.02 240)' }}>
            <img src={project.image} alt={`${project.title} preview`}
              className="w-full h-full object-cover opacity-80" loading="lazy" />
            <div className="absolute inset-0"
              style={{ background: 'linear-gradient(to top, oklch(8% 0.025 240 / 0.82), transparent 50%)' }} />
            <div className="absolute bottom-0 left-0 p-5 md:p-7">
              <div className="text-[9px] font-sora tracking-[0.25em] uppercase mb-1"
                style={{ color: 'oklch(75% 0.18 185)' }}>
                Quest {String(idx + 1).padStart(2, '0')} — {project.subtitle}
              </div>
              <h1 className="font-bebas text-4xl md:text-6xl leading-none"
                style={{ color: 'oklch(95% 0.01 240)' }}>
                {project.title}
              </h1>
            </div>
          </div>
        </GlassPanel>

        {/* Two-column body */}
        <div className="flex flex-col xl:flex-row gap-5 max-w-5xl">

          {/* Left — description + highlights */}
          <div className="flex-1 space-y-4">
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <GlassPanel className="p-5 md:p-6">
                <div className="text-[9px] font-sora tracking-[0.25em] uppercase mb-3"
                  style={{ color: 'oklch(65% 0.04 240)' }}>Overview</div>
                <p className="text-sm md:text-base font-sora leading-relaxed"
                  style={{ color: 'oklch(80% 0.02 240)' }}>
                  {project.description}
                </p>
              </GlassPanel>
            </motion.div>

            {project.highlights.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 }}>
                <GlassPanel className="p-5 md:p-6 teal-box-glow">
                  <div className="text-[9px] font-sora tracking-[0.25em] uppercase mb-4"
                    style={{ color: 'oklch(75% 0.18 185)' }}>◈ How it works</div>
                  <ul className="space-y-3">
                    {project.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0"
                          style={{ background: 'oklch(75% 0.18 185)' }} />
                        <span className="text-sm font-sora leading-relaxed"
                          style={{ color: 'oklch(82% 0.02 240)' }}>{h}</span>
                      </li>
                    ))}
                  </ul>
                </GlassPanel>
              </motion.div>
            )}
          </div>

          {/* Right — tech stack + links */}
          <div className="xl:w-72 space-y-4">
            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.15 }}>
              <GlassPanel className="p-5">
                <div className="text-[9px] font-sora tracking-[0.25em] uppercase mb-3"
                  style={{ color: 'oklch(65% 0.04 240)' }}>Tech Stack</div>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map(tag => (
                    <span key={tag} className="text-xs font-sora px-3 py-1 rounded-full"
                      style={{
                        background: 'oklch(75% 0.18 185 / 0.1)',
                        color: 'oklch(85% 0.20 185)',
                        border: '1px solid oklch(75% 0.18 185 / 0.3)',
                      }}>
                      {tag}
                    </span>
                  ))}
                </div>
              </GlassPanel>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay: 0.22 }}>
              <GlassPanel className="p-5">
                <div className="text-[9px] font-sora tracking-[0.25em] uppercase mb-4"
                  style={{ color: 'oklch(65% 0.04 240)' }}>Links</div>
                <div className="flex flex-col gap-3">
                  <a href={project.repo} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-sora text-sm font-semibold
                               transition-all hover:opacity-90 active:scale-95
                               focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                    style={{
                      background: 'oklch(75% 0.18 185)',
                      color: 'oklch(8% 0.025 240)',
                      outlineColor: 'oklch(75% 0.18 185)',
                    }}>
                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0" aria-hidden="true">
                      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
                    </svg>
                    View Code on GitHub
                  </a>
                  {project.demo && (
                    <a href={project.demo} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-sora text-sm border
                                 transition-all hover:opacity-90 active:scale-95
                                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                      style={{
                        color: 'oklch(83% 0.22 155)',
                        borderColor: 'oklch(83% 0.22 155 / 0.4)',
                        outlineColor: 'oklch(83% 0.22 155)',
                      }}>
                      ↗ Open Live Demo
                    </a>
                  )}
                </div>
              </GlassPanel>
            </motion.div>
          </div>

        </div>
      </main>
    </PageTransition>
  )
}
